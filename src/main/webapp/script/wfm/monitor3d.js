// =============================================================================
//  monitor3d.js  —  3D 厂图（数字孪生）P0
//  复用 2D 的数据接口（getSvgFile / getEqpStatusMaps / listFloorDef），
//  把每层 SVG 的设备/端口 footprint 拉伸成立方体，按实时状态着色。
//  单层显示，仅设备 + Port。几何来源仍是 SVG。
// =============================================================================

// ---- 全局状态 --------------------------------------------------------------
var g_floorNo = "F1";
var g_lotType = "";
var g_colorMap = null;
var g_pollTimer = null;

// glTF 模型注册表（eqpId -> { source, url, transform, portNodeMap }）与加载器
var g_modelDefs = {};
var g_gltfLoader = null;
var g_buildToken = 0;                  // 楼层重建令牌，丢弃过期的异步 glTF 回调

// 未在注册表登记的设备，默认使用的基础模型（按端口顺序绑定到 Port_1..Port_N）
var DEFAULT_MODEL_URL = "models/fab_tool.gltf";
// glTF 模型缓存：同一 url 只加载/解析一次，之后克隆复用（支撑上百台设备）
var g_modelCache = {};                 // url -> 模板 scene
var g_modelPending = {};               // url -> [{onReady,onError}]

var THREE_REF = window.THREE;

// three.js 对象
var scene, camera, renderer, labelRenderer, controls, raycaster;
var floorGroup = null;                 // 当前楼层的所有 mesh 容器
var meshByEqpId = {};                  // eqpId  -> { box, edges, label, info }
var meshByPortId = {};                 // mcpPortID -> { box, label }
var pickables = [];                    // 供射线拾取的 mesh 列表
var g_pointer = new THREE_REF.Vector2();
var g_hover = null;

// 视图常量
var TARGET_WIDTH = 300;                // 整层归一化到的 3D 宽度（世界单位）
var g_scale = 1;                       // SVG 用户单位 -> 世界单位
var g_centerX = 0, g_centerY = 0;      // SVG 内容中心（用户单位）

// 设备代理高度：按 eqpCategory，缺省用 DEFAULT。glTF 接入后（P2）有模型者忽略此值。
var EQP_HEIGHT = {
    "P": 14,   // Process / 工艺设备偏高
    "M": 12,   // Metro / 量测
    "U": 8,    // Utility / 辅助
    "T": 10,   // Transport / 搬送
    "DEFAULT": 10
};
var PORT_RAISE = 1.2;                   // 端口块相对设备顶面抬高
var PORT_HEIGHT = 2.5;                  // 端口块自身高度

// ---- 入口 ------------------------------------------------------------------
$(function () {
    if (!THREE_REF) {
        alert("three.js 未加载，无法显示 3D 厂图。");
        return;
    }
    $("#active_menu").val("MONITOR");

    init3D();
    loadFloorList();
    // 先拿模型注册表，再建楼层（保证首次 build 时已知哪些设备用 glTF）
    loadModelDefs(function () { loadFloor(); });

    $("#floorNoSelect").on("change", function () {
        g_floorNo = $("#floorNoSelect").val();
        loadFloor();
    });

    // 关闭右键菜单
    $(document).click(function () { $(".contextmenu").hide(); });
    $(document).on("contextmenu", function () { return false; });
});

// ---- three.js 场景初始化 ---------------------------------------------------
function init3D() {
    var container = document.getElementById("view3d");
    var w = container.clientWidth;
    var h = container.clientHeight;

    scene = new THREE_REF.Scene();
    scene.background = new THREE_REF.Color(0x0e1116);

    camera = new THREE_REF.PerspectiveCamera(55, w / h, 0.1, 100000);
    camera.position.set(0, TARGET_WIDTH * 0.8, TARGET_WIDTH * 0.9);

    renderer = new THREE_REF.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // CSS2D 标签层（设备/端口文字）
    labelRenderer = new THREE_REF.CSS2DRenderer();
    labelRenderer.setSize(w, h);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    labelRenderer.domElement.style.left = "0px";
    labelRenderer.domElement.style.pointerEvents = "none";
    container.appendChild(labelRenderer.domElement);

    // 灯光
    var hemi = new THREE_REF.HemisphereLight(0xffffff, 0x444455, 1.0);
    hemi.position.set(0, 500, 0);
    scene.add(hemi);
    var dir = new THREE_REF.DirectionalLight(0xffffff, 0.6);
    dir.position.set(TARGET_WIDTH, TARGET_WIDTH, TARGET_WIDTH * 0.5);
    scene.add(dir);

    // 地面
    var ground = new THREE_REF.Mesh(
        new THREE_REF.PlaneGeometry(TARGET_WIDTH * 3, TARGET_WIDTH * 3),
        new THREE_REF.MeshStandardMaterial({ color: 0x1b2230, roughness: 1, metalness: 0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    scene.add(ground);
    var grid = new THREE_REF.GridHelper(TARGET_WIDTH * 3, 60, 0x33415c, 0x222b3a);
    grid.position.y = 0;
    scene.add(grid);

    // 控制器
    controls = new THREE_REF.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0, 0);

    raycaster = new THREE_REF.Raycaster();
    g_gltfLoader = new THREE_REF.GLTFLoader();

    // 交互事件
    renderer.domElement.addEventListener("mousemove", onPointerMove, false);
    renderer.domElement.addEventListener("click", onClick, false);
    window.addEventListener("resize", onResize, false);

    animate();
}

function onResize() {
    var container = document.getElementById("view3d");
    var w = container.clientWidth;
    var h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) { controls.update(); }
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// ---- 数据加载 --------------------------------------------------------------
function authHeader(request) {
    request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
}

function loadFloorList() {
    $.ajax({
        url: "api/listFloorDef",
        type: "POST",
        dataType: "json",
        beforeSend: authHeader,
        data: {},
        success: function (data) {
            $("#floorNoSelect").empty();
            $.each(data, function (index, item) {
                var floorId = item.floorId.trim();
                var floorName = item.floorName.trim();
                $("#floorNoSelect").append("<option value='" + floorId + "'>" + floorName + "</option>");
            });
            $("#floorNoSelect").val(g_floorNo);
        },
        error: function () {
            document.getElementById("floorNoSelect").options.length = 0;
            document.getElementById("floorNoSelect").options.add(new Option("loading failed", ""));
        }
    });
}

// 加载设备模型注册表（一次）。失败则空表 -> 全部走拉伸。
function loadModelDefs(cb) {
    $.ajax({
        url: "api/getEqpModelDefs",
        type: "POST",
        dataType: "json",
        beforeSend: authHeader,
        data: {},
        success: function (data) { g_modelDefs = data || {}; if (cb) { cb(); } },
        error: function () { g_modelDefs = {}; if (cb) { cb(); } }
    });
}

// 解析某设备的模型条目：先按 eqpId，再按类别键 "CAT:<eqpCategory>"
function resolveModelEntry(eqpId, info) {
    if (g_modelDefs[eqpId]) { return g_modelDefs[eqpId]; }
    var cat = info.eqpStatus && info.eqpStatus.eqpCategory;
    if (cat && g_modelDefs["CAT:" + cat]) { return g_modelDefs["CAT:" + cat]; }
    // 未登记 -> 使用默认基础模型（端口按顺序绑定）
    return { source: "gltf", url: DEFAULT_MODEL_URL, portNodeMap: {}, isDefault: true };
}

// 加载某层：先取 SVG（几何来源），再取状态并建模
function loadFloor() {
    stopPolling();
    $.ajax({
        url: "api/getSvgFile",
        type: "POST",
        beforeSend: authHeader,
        data: { "floorNo": g_floorNo },
        success: function (svgText) {
            $("#svgGeomHost").html(svgText);
            fetchStatusAndBuild(true);
        },
        error: function () {
            console.error("getSvgFile failed for floor " + g_floorNo);
        }
    });
}

function fetchStatusAndBuild(rebuild) {
    $.ajax({
        url: "api/getEqpStatusMaps",
        type: "POST",
        beforeSend: authHeader,
        data: { lotType: g_lotType, "currentDate": (new Date()) + "" },
        success: function (eqpStatusMap) {
            var list = eqpStatusMap.eqpStatusList;
            g_colorMap = eqpStatusMap.colorMap;
            if (!list || list.length === 0) {
                console.warn("eqpStatusList empty");
                startPolling();
                return;
            }
            if (rebuild) {
                buildFloor(list);
            } else {
                applyStatus(list);
            }
            updateStatusCount(list);
            startPolling();
        },
        error: function () {
            startPolling();
        }
    });
}

function startPolling() {
    stopPolling();
    g_pollTimer = setInterval(function () { fetchStatusAndBuild(false); }, 5000);
}
function stopPolling() {
    if (g_pollTimer) { clearInterval(g_pollTimer); g_pollTimer = null; }
}

// ---- SVG 几何解析 ----------------------------------------------------------
// 取元素在 SVG 根用户坐标系下的轴对齐矩形（综合自身 transform）
function rectFromElement(el) {
    if (!el || typeof el.getBBox !== "function") { return null; }
    var bbox;
    try { bbox = el.getBBox(); } catch (e) { return null; }
    if (!bbox || bbox.width === 0 || bbox.height === 0) { return null; }
    var m = el.getCTM();
    var pts = [
        [bbox.x, bbox.y],
        [bbox.x + bbox.width, bbox.y],
        [bbox.x + bbox.width, bbox.y + bbox.height],
        [bbox.x, bbox.y + bbox.height]
    ];
    var minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    for (var i = 0; i < pts.length; i++) {
        var px = pts[i][0], py = pts[i][1];
        var X = px, Y = py;
        if (m) {
            X = m.a * px + m.c * py + m.e;
            Y = m.b * px + m.d * py + m.f;
        }
        if (X < minx) minx = X; if (X > maxx) maxx = X;
        if (Y < miny) miny = Y; if (Y > maxy) maxy = Y;
    }
    return { x: minx, y: miny, w: maxx - minx, h: maxy - miny };
}

// SVG 用户坐标 -> 3D 世界坐标（X 向右，Z 向后；Y 为高度）
function toWorld(svgX, svgY) {
    return {
        x: (svgX - g_centerX) * g_scale,
        z: (svgY - g_centerY) * g_scale
    };
}

function proxyHeight(category) {
    if (category && EQP_HEIGHT[category] != null) { return EQP_HEIGHT[category]; }
    return EQP_HEIGHT.DEFAULT;
}

function safeColor(c, fallback) {
    if (c && typeof c === "string" && c.charAt(0) === "#") { return c; }
    return fallback;
}

// ---- 建模 ------------------------------------------------------------------
function clearFloor() {
    g_buildToken++;                    // 使进行中的 glTF 异步回调失效
    if (floorGroup) {
        scene.remove(floorGroup);
        floorGroup.traverse(function (o) {
            if (o.geometry) { o.geometry.dispose(); }
            if (o.material) {
                if (Array.isArray(o.material)) { o.material.forEach(function (m) { m.dispose(); }); }
                else { o.material.dispose(); }
            }
        });
    }
    floorGroup = new THREE_REF.Group();
    scene.add(floorGroup);
    meshByEqpId = {};
    meshByPortId = {};
    pickables = [];
}

function buildFloor(list) {
    clearFloor();

    var rootSvg = document.querySelector("#svgGeomHost svg");
    if (!rootSvg) { console.error("injected SVG not found"); return; }

    // 整层内容范围（根用户单位）-> 居中 + 归一化比例
    var bounds;
    try { bounds = rootSvg.getBBox(); } catch (e) { bounds = null; }
    if (!bounds || bounds.width === 0) {
        bounds = { x: 0, y: 0, width: parseFloat(rootSvg.getAttribute("width")) || 1000, height: parseFloat(rootSvg.getAttribute("height")) || 1000 };
    }
    g_centerX = bounds.x + bounds.width / 2;
    g_centerY = bounds.y + bounds.height / 2;
    g_scale = TARGET_WIDTH / bounds.width;

    var built = 0;
    for (var i = 0; i < list.length; i++) {
        var info = list[i];
        var st = info.eqpStatus;
        if (!st || !st.eqpId) { continue; }
        var eqpId = st.eqpId;
        var el = document.getElementById(eqpId);
        if (!el) { continue; }                 // 该层 SVG 未画此设备 -> 跳过（与 2D 一致）

        var rect = rectFromElement(el);
        if (!rect) { continue; }

        var entry = resolveModelEntry(eqpId, info);
        if (entry && entry.source === "gltf" && entry.url) {
            // 数字孪生：用真实 glTF 模型（端口绑定到模型节点）
            addEquipmentGltf(eqpId, info, rect, entry, g_buildToken);
            built += 1;
        } else {
            // 回退：2D footprint 拉伸 + 合成端口
            built += addEquipment(eqpId, info, rect);
            var ports = info.eqpPortStatusList || [];
            for (var p = 0; p < ports.length; p++) {
                addPort(eqpId, info, ports[p], p, ports.length);
            }
        }
    }

    fitCameraToFloor();
    console.log("buildFloor: " + built + " equipment rendered on " + g_floorNo);
}

function addEquipment(eqpId, info, rect) {
    var st = info.eqpStatus;
    var h = proxyHeight(st.eqpCategory);

    var c0 = toWorld(rect.x, rect.y);
    var c1 = toWorld(rect.x + rect.w, rect.y + rect.h);
    var wx = Math.abs(c1.x - c0.x);
    var wz = Math.abs(c1.z - c0.z);
    if (wx < 0.2) wx = 0.2;
    if (wz < 0.2) wz = 0.2;
    var cx = (c0.x + c1.x) / 2;
    var cz = (c0.z + c1.z) / 2;

    var topColor = safeColor(st.curStateIdColor, "#888888");
    var edgeColor = safeColor(st.eqpModeColor, "#000000");

    var geo = new THREE_REF.BoxGeometry(wx, h, wz);
    var mat = new THREE_REF.MeshStandardMaterial({ color: new THREE_REF.Color(topColor), roughness: 0.7, metalness: 0.05 });
    var box = new THREE_REF.Mesh(geo, mat);
    box.position.set(cx, h / 2, cz);
    box.userData = { type: "eqp", eqpId: eqpId, info: info };
    floorGroup.add(box);
    pickables.push(box);

    // 边框（设备 mode 颜色）
    var edges = new THREE_REF.LineSegments(
        new THREE_REF.EdgesGeometry(geo),
        new THREE_REF.LineBasicMaterial({ color: new THREE_REF.Color(edgeColor) })
    );
    edges.position.copy(box.position);
    floorGroup.add(edges);

    // 设备 ID 标签
    var label = makeLabel(eqpId, "v3d-label");
    label.position.set(cx, h + 1.5, cz);
    floorGroup.add(label);

    meshByEqpId[eqpId] = { box: box, edges: edges, label: label, info: info, cx: cx, cz: cz, wx: wx, wz: wz, h: h };
    return 1;
}

// 端口：优先用 SVG 中 id=mcpPortID 的真实 footprint；
// 若该层 SVG 未画端口元素，则在设备顶面前缘**合成**端口块（FAB load port 通常排在设备一侧）。
function addPort(eqpId, info, port, idx, total) {
    var eqp = meshByEqpId[eqpId];
    var rect = null;
    if (port.mcpPortID) {
        var el = document.getElementById(port.mcpPortID);
        if (el) { rect = rectFromElement(el); }
    }

    var cx, cz, wx, wz, topY;
    if (rect) {
        // 真实端口 footprint
        var c0 = toWorld(rect.x, rect.y);
        var c1 = toWorld(rect.x + rect.w, rect.y + rect.h);
        wx = Math.max(Math.abs(c1.x - c0.x), 0.6);
        wz = Math.max(Math.abs(c1.z - c0.z), 0.6);
        cx = (c0.x + c1.x) / 2;
        cz = (c0.z + c1.z) / 2;
        topY = eqp ? eqp.h : proxyHeight(info.eqpStatus.eqpCategory);
    } else {
        // 合成：沿设备 +Z 前缘均匀分布
        if (!eqp) { return; }
        topY = eqp.h;
        var n = Math.max(total || 1, 1);
        var slot = eqp.wx / n;
        wx = Math.max(Math.min(slot * 0.7, eqp.wx * 0.4), 0.6);
        wz = Math.max(Math.min(eqp.wz * 0.35, wx), 0.6);
        cx = eqp.cx - eqp.wx / 2 + slot * (idx + 0.5);
        cz = eqp.cz + eqp.wz / 2 - wz * 0.7;
    }

    var portElId = port.mcpPortID || (eqpId + "_PORT" + idx);
    var portColor = safeColor(port.portStateColor, "#ffe27a");

    var geo = new THREE_REF.BoxGeometry(wx, PORT_HEIGHT, wz);
    var mat = new THREE_REF.MeshStandardMaterial({
        color: new THREE_REF.Color(portColor),
        emissive: new THREE_REF.Color(portColor),
        emissiveIntensity: 0.45,
        roughness: 0.5, metalness: 0.1
    });
    var box = new THREE_REF.Mesh(geo, mat);
    box.position.set(cx, topY + PORT_RAISE + PORT_HEIGHT / 2, cz);
    box.userData = { type: "port", eqpId: eqpId, portId: port.portId, mcpPortID: portElId, port: port, info: info };
    floorGroup.add(box);
    pickables.push(box);

    var label = makeLabel(port.portId || portElId, "v3d-label port");
    label.position.set(cx, topY + PORT_RAISE + PORT_HEIGHT + 1.0, cz);
    floorGroup.add(label);

    meshByPortId[portElId] = { box: box, label: label };
}

// 取一个模型实例：同一 url 仅加载一次，之后返回克隆体（几何共享、材质按需克隆）
function getModelInstance(url, onReady, onError) {
    if (g_modelCache[url]) { onReady(g_modelCache[url].clone(true)); return; }
    if (g_modelPending[url]) { g_modelPending[url].push({ onReady: onReady, onError: onError }); return; }
    g_modelPending[url] = [{ onReady: onReady, onError: onError }];
    g_gltfLoader.load(url, function (gltf) {
        var tmpl = gltf.scene || (gltf.scenes && gltf.scenes[0]);
        g_modelCache[url] = tmpl;
        var cbs = g_modelPending[url] || []; delete g_modelPending[url];
        cbs.forEach(function (c) { try { c.onReady(tmpl.clone(true)); } catch (e) { if (c.onError) c.onError(e); } });
    }, undefined, function (err) {
        var cbs = g_modelPending[url] || []; delete g_modelPending[url];
        cbs.forEach(function (c) { if (c.onError) c.onError(err); });
    });
}

// 用 glTF 模型表示设备：按 SVG footprint 定位/缩放，端口状态绑定到模型节点
function addEquipmentGltf(eqpId, info, rect, entry, token) {
    var c0 = toWorld(rect.x, rect.y);
    var c1 = toWorld(rect.x + rect.w, rect.y + rect.h);
    var fpW = Math.max(Math.abs(c1.x - c0.x), 0.6);   // footprint 世界尺寸
    var fpD = Math.max(Math.abs(c1.z - c0.z), 0.6);
    var cx = (c0.x + c1.x) / 2;
    var cz = (c0.z + c1.z) / 2;
    var tf = entry.transform || {};

    getModelInstance(entry.url, function (model) {
        if (token !== g_buildToken) { return; }       // 楼层已切换，丢弃
        if (!model) { return; }

        // 缩放：默认把模型 XZ footprint 贴合设备矩形
        var pre = new THREE_REF.Box3().setFromObject(model);
        var size = pre.getSize(new THREE_REF.Vector3());
        var s = 1;
        if (tf.scaleToFootprint !== false && size.x > 1e-6 && size.z > 1e-6) {
            s = Math.min(fpW / size.x, fpD / size.z);
        }
        if (tf.scale) { s *= tf.scale; }
        model.scale.set(s, s, s);
        if (tf.rotateY) { model.rotation.y = tf.rotateY * Math.PI / 180; }

        // 落地：底面贴地，水平居中到设备中心
        var post = new THREE_REF.Box3().setFromObject(model);
        var pc = post.getCenter(new THREE_REF.Vector3());
        model.position.x += cx - pc.x;
        model.position.z += cz - pc.z;
        model.position.y += -post.min.y + (tf.offsetY || 0);

        floorGroup.add(model);

        // 设备主体：可拾取
        var topY = (new THREE_REF.Box3().setFromObject(model)).max.y;
        model.traverse(function (o) {
            if (o.isMesh) {
                o.userData = { type: "eqp", eqpId: eqpId, info: info };
                pickables.push(o);
            }
        });

        var label = makeLabel(eqpId, "v3d-label");
        label.position.set(cx, topY + 1.5, cz);
        floorGroup.add(label);
        meshByEqpId[eqpId] = { root: model, label: label, info: info, type: "gltf", cx: cx, cz: cz, h: topY };

        // 端口：优先绑定到模型命名节点；无对应节点则合成
        var portNodeMap = entry.portNodeMap || {};
        var ports = info.eqpPortStatusList || [];
        for (var i = 0; i < ports.length; i++) {
            var port = ports[i];
            // 优先用注册表 portNodeMap；否则按顺序绑定到 Port_1..Port_N（默认模型）
            var nodeName = portNodeMap[port.portId] || ("Port_" + (i + 1));
            var node = model.getObjectByName(nodeName);
            if (node) {
                var col = safeColor(port.portStateColor, "#ffe27a");
                recolorObject(node, col);
                node.userData = { type: "port", eqpId: eqpId, portId: port.portId, mcpPortID: port.mcpPortID, port: port, info: info };
                node.traverse(function (o) { if (o.isMesh) { pickables.push(o); } });
                var wp = node.getWorldPosition(new THREE_REF.Vector3());
                var plabel = makeLabel(port.portId || port.mcpPortID, "v3d-label port");
                plabel.position.set(wp.x, wp.y + 1.0, wp.z);
                floorGroup.add(plabel);
                meshByPortId[port.mcpPortID] = { gltfObj: node, label: plabel };
            } else {
                // 模型未提供该端口节点 -> 合成端口块叠加在模型顶面
                addPort(eqpId, info, port, i, ports.length);
            }
        }
    }, function (err) {
        console.error("glTF load failed for " + eqpId + " (" + entry.url + "), fallback to extrude.", err);
        if (token !== g_buildToken) { return; }
        addEquipment(eqpId, info, rect);
        var ports2 = info.eqpPortStatusList || [];
        for (var k = 0; k < ports2.length; k++) { addPort(eqpId, info, ports2[k], k, ports2.length); }
    });
}

// 给一个对象（及其子 Mesh）重新着色（克隆材质，避免影响共享同材质的其它节点）
function recolorObject(obj, color) {
    obj.traverse(function (o) {
        if (o.isMesh && o.material) {
            if (!o.userData._matCloned) {
                o.material = Array.isArray(o.material) ? o.material.map(function (m) { return m.clone(); }) : o.material.clone();
                o.userData._matCloned = true;
            }
            var mats = Array.isArray(o.material) ? o.material : [o.material];
            for (var i = 0; i < mats.length; i++) {
                if (mats[i].color) { mats[i].color.set(color); }
                if (mats[i].emissive) { mats[i].emissive.set(color); mats[i].emissiveIntensity = 0.4; }
            }
        }
    });
}

function makeLabel(text, cls) {
    var div = document.createElement("div");
    div.className = cls;
    div.textContent = text;
    return new THREE_REF.CSS2DObject(div);
}

// ---- 仅刷新颜色（轮询调用，不重建几何）------------------------------------
function applyStatus(list) {
    for (var i = 0; i < list.length; i++) {
        var info = list[i];
        var st = info.eqpStatus;
        if (!st || !st.eqpId) { continue; }
        var rec = meshByEqpId[st.eqpId];
        if (rec) {
            rec.info = info;
            if (rec.box) {                 // 拉伸盒体：按状态着色
                rec.box.material.color.set(safeColor(st.curStateIdColor, "#888888"));
                rec.edges.material.color.set(safeColor(st.eqpModeColor, "#000000"));
                rec.box.userData.info = info;
            }
            // glTF 模型主体不按设备状态改色（保持真实外观），仅更新端口
        }
        var ports = info.eqpPortStatusList || [];
        for (var p = 0; p < ports.length; p++) {
            var port = ports[p];
            var prec = meshByPortId[port.mcpPortID];
            if (prec) {
                var col = safeColor(port.portStateColor, "#ffe27a");
                if (prec.box) {
                    prec.box.material.color.set(col);
                    prec.box.material.emissive.set(col);
                    prec.box.userData.port = port;
                } else if (prec.gltfObj) {
                    recolorObject(prec.gltfObj, col);
                    prec.gltfObj.userData.port = port;
                }
            }
        }
    }
}

function updateStatusCount(list) {
    var counts = {};
    for (var i = 0; i < list.length; i++) {
        var st = list[i].eqpStatus;
        if (!st) { continue; }
        if (!document.getElementById(st.eqpId)) { continue; } // 只统计本层
        var k = st.curStateId || "UNKNOWN";
        counts[k] = (counts[k] || 0) + 1;
    }
    var html = [];
    for (var key in counts) { html.push(key + ": " + counts[key]); }
    $("#eqp_status_cnt").html(html.join(",  "));
}

// ---- 相机自适应 ------------------------------------------------------------
function fitCameraToFloor() {
    var box = new THREE_REF.Box3().setFromObject(floorGroup);
    if (box.isEmpty()) { return; }
    var center = box.getCenter(new THREE_REF.Vector3());
    var size = box.getSize(new THREE_REF.Vector3());
    var maxDim = Math.max(size.x, size.z);
    controls.target.copy(center);
    camera.position.set(center.x, maxDim * 0.9, center.z + maxDim * 0.9);
    camera.near = 0.1;
    camera.far = maxDim * 50;
    camera.updateProjectionMatrix();
    controls.update();
}

// ---- 拾取交互 --------------------------------------------------------------
function updatePointer(event) {
    var rect = renderer.domElement.getBoundingClientRect();
    g_pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    g_pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function pick() {
    raycaster.setFromCamera(g_pointer, camera);
    var hits = raycaster.intersectObjects(pickables, false);
    return hits.length > 0 ? hits[0].object : null;
}

function onPointerMove(event) {
    updatePointer(event);
    var obj = pick();
    var tip = document.getElementById("view3d-tooltip");
    if (!obj) {
        if (g_hover) { g_hover = null; }
        tip.style.display = "none";
        renderer.domElement.style.cursor = "default";
        return;
    }
    g_hover = obj;
    renderer.domElement.style.cursor = "pointer";
    var d = obj.userData;
    var html = "";
    if (d.type === "eqp") {
        var st = d.info.eqpStatus;
        html = "<b>" + d.eqpId + "</b><br/>" + (st.eqpName || "") +
            "<br/>State: " + (st.e10State || "") + " / " + (st.curStateId || "") +
            "<br/>Mode: " + (st.eqpMode || "") +
            "<br/>WIP: " + (d.info.wipCnt != null ? d.info.wipCnt : 0);
    } else if (d.type === "port") {
        html = "<b>Port " + (d.portId || d.mcpPortID) + "</b><br/>Eqp: " + d.eqpId +
            "<br/>State: " + (d.port.portStateId || d.port.portState || "");
    }
    tip.innerHTML = html;
    tip.style.display = "block";
    tip.style.left = (event.clientX - renderer.domElement.getBoundingClientRect().left + 12) + "px";
    tip.style.top = (event.clientY - renderer.domElement.getBoundingClientRect().top + 12) + "px";
}

function onClick(event) {
    updatePointer(event);
    var obj = pick();
    if (!obj) { return; }
    var eqpId = obj.userData.eqpId;
    if (!eqpId) { return; }
    // 复用现有设备详情弹窗页（与 2D monitor 一致）
    window.open(
        "api/wfmWfviewEqpt#tab=inprlist&eqptid=" + eqpId,
        "_blank",
        "width=900,height=600,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no"
    );
}
