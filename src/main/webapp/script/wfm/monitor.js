
var currentGroupId = "";
var currentUserId = sessionStorage.getItem("currentUserId");
if( currentUserId == ""){
    currentUserId = 'admin';
}

var g_svgEqpAreaList = [];  //  用来记录所有的 SVG的 EQP区域 ID 
var g_eqpInfoList = [];     //  保存设备的状态信息. 
var g_eqpIdList = [];       // 只保存 设备ID列表. 

var g_eqpZoneList = [];                   // 区域与 ID 的 map的映射图.  

var g_initComplete = false;
var g_ajaxFailedTimes = 0;

var g_timer = [];
var g_clientWidth = 0;

var g_fontFamily = 'sans-serif';
var g_svg  = null;
var g_lotType = "";
var g_floorNo = "F1";

var svg_org_width = null;
var svg_org_height = null;
var g_textIdMap = [];
$(function() {
//    g_svgEqpAreaList = [];
//    g_eqpInfoList = [];
//    g_eqpIdList = [];
//    g_textIdMap = [];
    //privilege check
//    let temp=sessionStorage.getItem("userPrivilege");
//    let arr_temp=temp.split(",");
//    let privilege = [];
//    for(let i=0; i<arr_temp.length;i++){
//        privilege.push(arr_temp[i]);
//    }
    $("#active_menu").val("MONITOR");
    loadSvgFile();
    $.ajax({
            url: "api/listFloorDef",
            type: "POST",
            dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
            },
            data: { },
            success: function (data) {
                $("#floorNoSelect").empty();
                $.each(data, function (index, item) {
                    var floorId  = item.floorId.trim();
                    var floorName  = item.floorName.trim();
                    $("#floorNoSelect").append("<option value='" + floorId + "'>" + floorName + "</option>");
                });
            },
            error: function (e) {
                document.getElementById("floorNoSelect").options.length = 0;
                document.getElementById("floorNoSelect").options.add(new Option("loading failed", "loading failed"));
            }
        });
//    $.ajax({
//		url : "api/getSvgFile",
//		type : 'POST',
//		beforeSend: function(request) {
//            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
//        },
//		data:{ "floorNo" : g_floorNo},
//		success : function(data) {
//		   // console.log(data);
//           $('#FabViewZone').html(data);
//           g_eqpZoneList = [];
//
//           $("#active_menu").val("MONITOR");
//           $("#active_page").val("MONITOR");
//
//           g_currentZoneId = "FabViewZone";
//
//           g_clientWidth = 0;
//           try {
//               g_clientWidth = document.documentElement.clientWidth;
//           } catch (error) {
//           }
//
//           g_ajaxFailedTimes = 0;
//           g_initComplete = false;
//
//           timerTask();
//
//           /**
//            * 缩小放大.
//            */
//           g_svg = d3.select ("#FabViewZone svg")
//             .call(d3.zoom()
//             .scaleExtent([0.1, 20])
//             .on("zoom",redraw_v4));
//           g_svg.transition().duration(750).delay(500);
//           resize();
//
//	}});
	
    // if(privilege.indexOf('EGRPDEFW') < 0){
    //     document.getElementById('submit').disabled=true;
    // }

//    g_lotType = sessionStorage.getItem("wfm-lotType");
//    if( g_lotType == null || g_lotType == '' || g_lotType == 'null'){
//        g_lotType = 'All';  // default lotType
//    }

//    $("#lotTypeSelect").val(g_lotType);
      $("#floorNoSelect").val(g_floorNo);

    /***
     * 点击左上角的 ==,  左侧菜单栏的隐藏和显示.  
     */
    $("#sidebarToggleBtn").on("click", function (arg0) { 
        var WFM_LOGO_width = $("#WFM_LOGO").width();
        if( WFM_LOGO_width == 200){
            WFM_LOGO_width = 20;
        }else{
            WFM_LOGO_width = 200;
        }
        resize(WFM_LOGO_width);
    });

    $("#floorNoSelect").on("change", function (e) {
        console.log("Floor No: " + $("#floorNoSelect").val());
        g_floorNo = $("#floorNoSelect").val();
        loadSvgFile();
    });

    // 点击之后，右键菜单隐藏
    $(document).click(function() {
      $(".contextmenu").hide();
    });
    $(document).on("contextmenu",  function(e) {
		return false;
	 });
    return ;
});


$(window).resize(function(){
	resize();
});

function loadSvgFile() {
    g_svgEqpAreaList = [];
    g_eqpInfoList = [];
    g_eqpIdList = [];
    g_textIdMap = [];
    $.ajax({
        url: "api/getSvgFile",
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
        data: { "floorNo": g_floorNo },
        success: function (data) {
            $('#FabViewZone').html(data);
            g_eqpZoneList = [];
            $("#active_menu").val("MONITOR");
            $("#active_page").val("MONITOR");
            g_currentZoneId = "FabViewZone";
            g_clientWidth = 0;
            try {
                g_clientWidth = document.documentElement.clientWidth;
            } catch (error) {
            }

            g_ajaxFailedTimes = 0;
            g_initComplete = false;

            timerTask();

            /**
             * 缩小放大.
             */
            g_svg = d3.select("#FabViewZone svg")
                .call(d3.zoom()
                    .scaleExtent([0.1, 20])
                    .on("zoom", redraw_v4));
            g_svg.transition().duration(750).delay(500);
            resize();

        }
    });
}
/**
 * 窗口改变大小的事件. 
 */
function resize( WFM_LOGO_width )
{
    if( WFM_LOGO_width == null || WFM_LOGO_width == 0){
        WFM_LOGO_width = $("#WFM_LOGO").width();
    }
    
    if(svg_org_width == null){
        svg_org_width = d3.select ("#FabViewZone svg").attr('width');
    }
    if(svg_org_height == null){
        svg_org_height = d3.select ("#FabViewZone svg").attr('height');
    }
    
    var w = document.documentElement.clientWidth - WFM_LOGO_width - 10 ;
    var h = document.documentElement.clientHeight - 135;

    if( w < 640){
        w = 640;
    }
    if( h < 480){
        h = 480;
    }

    d3.select ("#FabViewZone svg").attr('width', w);
    d3.select ("#FabViewZone svg").attr('height', h);
    d3.select ("#FabViewZone svg").attr('shape-rendering', 'geometricPrecision');
}

var g_svg_x = 0;
var g_svg_y = 0;

function redraw_v4( )
{
    d3.select(this)
        .select('g')
        .attr("transform", d3.zoomTransform(g_svg.node()));
    return;
}


function reStartTimerTask( success, immediately)
{
    if( g_timer != null && g_timer.length > 0 ){
        try {
            for(var i = 0; i < g_timer.length; ++i){
                window.clearInterval(g_timer[i]);
            }
        } catch (error) {
        }
        g_timer = [];
    }

    //  如果 上一次刷新成功, 就 每隔 5  秒, 再刷新一次.
    //  如果 上一次刷新失败, 就 每隔 10 秒, 再刷新
    var sec = 10;
    if( success ){
        sec = 5;
    }
    if(immediately != null && immediately == true){
        sec = 1;
    }
    // 每隔 N 秒执行一次.
    g_timer.push(setInterval("timerTask()", 1000*sec));
    g_timer.push(setInterval("refreshOHT()", 1000*2)); // 2秒执行一次
}

function refreshOHT()
{
	$.ajax({
		url: "api/getOHTStatus",
		type: 'POST',
		beforeSend: function(request) {
			request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
		},
		data: {},
		success: function(data) {
			var mcpInfo = data.mcpInfo;
			if (mcpInfo != null) {
				updateVehicleState(mcpInfo); // OHT Vehicle
				updateStationState(mcpInfo.stationList);//OTH Station
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			reStartTimerTask(false);
		}
	});
}

function timerTask()
{
    // 获取所有设备的端口号和 Chamber ID, 数据保存到 g_eqpInfoList 中.
    $.ajax({
		url:"api/getEqpStatusMaps",
		type:'POST',
		beforeSend: function(request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
		},
		data:{ lotType: g_lotType, 'currentDate': (new Date()) + '' },
		success : function(eqpStatusMap){
            var data = eqpStatusMap.eqpStatusList;
            var colorMap = eqpStatusMap.colorMap;
            var mcpInfo = eqpStatusMap.mcpInfo;
            if( data == null || data.length == 0){
                alert(sessionStorage.getItem("wfm.wfm.no.eqpId"));
                reStartTimerTask(false);
                return;
            }
            calculateWipCnt(data);  // 计算 WipCnt
            g_ajaxFailedTimes = 0;
            g_eqpIdList = [];
            g_eqpInfoList = [];
            $.each(data, function (index, eqpInfo) {
                // eqpInfo.fabArea_divId =  "FabViewZone";
                eqpInfo.eqpArea_divIds = [];
                g_eqpInfoList.push(eqpInfo);
                g_eqpIdList.push(eqpInfo.eqpStatus.eqpId);
            });
            if( g_initComplete ){
                refreshAllEqpStatus(colorMap);
                start_drawSvgHeader(colorMap);  //refresh svg header
                refreshSvgHeader( colorMap );
                reStartTimerTask(true);
                showTextInfo(g_textIdMap,g_eqpInfoList);
                return;
            }
            console.log(" g_initComplete = false, need showAllEqpPortCh, refreshAllEqpStatus,  start_drawSvgHeader ");
            var tmpEqpIdList = showAllEqpPortCh("FabViewZone", g_eqpIdList, g_eqpInfoList, false);
            g_eqpZoneList.push(
            {
                'viewId' : "FabViewZone",
                'eqpIds' : tmpEqpIdList,
            });
            refreshAllEqpStatus(colorMap);
            start_drawSvgHeader(colorMap);
            refreshSvgHeader( colorMap );
            reStartTimerTask(true, true );
            g_initComplete = true;
            zoomSvgToFullScreen();
            console.log(" g_initComplete = true,  <<<----------- ");
		},
		error:function(jqXHR, textStatus, errorThrown){
            reStartTimerTask(false);
		}
    });
}


function zoomSvgToFullScreen()
{
    if(svg_org_width == null){
        svg_org_width = 7000;
    }
    if(svg_org_height == null){
        svg_org_height = 5000;
    }
    console.log( 'set viewBox( 0, 0, '+svg_org_width+', '+ svg_org_height + ') ');
    d3.select("#FabViewZone svg").attr('viewBox', '0, 0, '+svg_org_width+', '+ svg_org_height );
    
}

function GET_SVG_HEADER(div_parentAreaId, startX, startY, eqpWidth, eqpHeight, eqpColumnSize, eqpCount, fillColor)
{
    var old_eqpColumnSize = eqpColumnSize;
    if(eqpCount <  eqpColumnSize){
        eqpColumnSize = eqpCount;
    }

    var width = startX + eqpWidth * eqpColumnSize ;
    var height = startY + ( Math.ceil(eqpCount/eqpColumnSize)) * eqpHeight;

    if( old_eqpColumnSize != 1){
        if(width < 800) {
            width = 800;
        }
        if(height < 600){
            height = 600; 
        }
    }

    var  str  = '<div id="' + div_parentAreaId + '"  style="width: '+(width+1)+'px; height: '+(height+1)+'px;"> ' + 
        '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"  \
        preserveAspectRatio="none" x="0px" y="0px" width="'+ width +'px" height="'+ height +'px" viewBox="0 0 '+ width +' '+ height +'">';

        if( fillColor != null && fillColor != "") {
            str += '<rect fill="'+fillColor+'" width="'+ width +'" height="'+ height +'" id="canvas_background"  x="-1" y="-1"/>';
        }

    return str; 
}
function GET_SVG_DEFS_START()
{
    return ' <defs> ';
}
function GET_SVG_DEFS_END()
{
    return ' </defs> ';
}

function GET_SVG_G_ID_START(eqpId)
{
    // var eqpId = svgMainData.eqpId;
    return '<g id="'+ eqpId +'_Layer0">';
}
function GET_SVG_G_ID_END()
{
    return '</g>';
}



/**
 * 
 *    O --------->  
 *    | 
 *    | 
 *    | 
 *    V 
 */
function GET_START_XY_03(boxStartX, boxStartY, boxWidth, boxHeight, colCnt, currentIndex, count )
{
    var chWidth = ( (boxHeight>boxWidth?boxWidth:boxHeight) / 2 / 3 );
    if( chWidth > 30){
        chWidth = 30;
    }
    if( chWidth <= 2){
        chWidth = 2;
    }

    if( count < colCnt){
        colCnt =  count;
    }

    currentIndex -= 1;

    var col = currentIndex % colCnt;
    var row = parseInt((currentIndex)/colCnt); 
    var rowCnt = parseInt((count - 1)/colCnt); 
    // console.log("row: " + row + ",  col: " + col);

    var startX = boxStartX + boxWidth - chWidth * (colCnt - col );
    var startY = boxStartY + boxHeight - chWidth * (rowCnt - row + 1 );
    var c = chWidth / 5 * 4 ;

    return {
        startX:startX,
        startY:startY,
        c:c,
    }

}


/**
 * 
 *            ^ 
 *            | 
 *            | 
 *            | 
 *    <-------O 
 */

function GET_START_XY_04(boxStartX, boxStartY, boxWidth, boxHeight, colCnt, currentIndex, count )
{
    var chWidth = ( (boxHeight>boxWidth?boxWidth:boxHeight) / 2 / 3 );
    if( chWidth > 30){
        chWidth = 30;
    }
    if( chWidth <=2){
        chWidth = 2;
    }


    currentIndex -= 1;

    var col = currentIndex % colCnt;
    var row = parseInt((currentIndex)/colCnt) + 1; 
    console.log("row: " + row + ",  col: " + col);

    var startX = boxStartX + boxWidth - chWidth - chWidth * col ;
    var startY = boxStartY + boxHeight - chWidth * row;
    var c = chWidth / 5 * 4 ;

    return {
        startX:startX,
        startY:startY,
        c:c,
    }

}


function DRAW_SVG_TEXT(parentId, eqpId, x, y, text, Alignment, fontSize, keyId)
{
    eqpId = eqpId.replaceAll(' ', '').replaceAll('.', '_');
    var $rect = createSvg('text', {  
        'x': x,
        'y': y,
        'id': eqpId + '_text_' + keyId,  
        'name': eqpId + '_text_' + keyId,  
        'fill' : '#000000'             ,
        'font-family' : g_fontFamily        ,
        'font-size' : fontSize         ,
        'stroke' : '#000'              ,
        'stroke-dasharray' : 'null'    ,
        'stroke-linecap' : 'null'      ,
        'stroke-linejoin' : 'null'     ,
        'stroke-width' : '0'           ,
        'text-anchor' : Alignment         ,
        'xml:space' : 'preserve'       ,
    }).appendTo($('#'+parentId+' svg g'));    
 
    $('#'+parentId+' #'+ eqpId +'_text_' + keyId).html( text );
}

 
function DRAW_SVG_LOT_CNT_TEXT(parentId, startX, startY, eqpInfo, fontSize)
{
    var x = parseFloat(startX) + parseFloat(fontSize) * 0.2;
    var y = parseFloat(startY) + parseFloat(fontSize) * 1.25 + 2;
    // var text = ' ' + eqpInfo.inprocessLotCnt + '/' + eqpInfo.wipCnt;
    var text = ' ' + eqpInfo.wipCnt;
    var eqpId = eqpInfo.eqpStatus.eqpId;
    var alignment = 'left';
    
    DRAW_SVG_TEXT(parentId, eqpId, x, y, text, alignment, fontSize, 'lotCnt');
}   

function DRAW_SVG_LOT_ID_TEXT(parentId, startX, startY, eqpInfo, fontSize)
{
    var text = ' ';
    if( eqpInfo.inprocessLotIds != null && eqpInfo.inprocessLotIds.length > 0){
        text =  eqpInfo.inprocessLotIds[0];
    }

    var x = parseFloat(startX) ; // + parseFloat(fontSize) * 0.1;
    var y = parseFloat(startY) ; //  + parseFloat(fontSize) * 1.2;
    // var y = parseFloat(startY) + parseFloat(fontSize) * 3.2 ;
    var eqpId = eqpInfo.eqpStatus.eqpId;
    var alignment = 'left';
    
    DRAW_SVG_TEXT(parentId, eqpId, x, y, text, alignment, fontSize, 'lotId');
}   


function DRAW_SVG_EQP_ID_TEXT(parentId, startX, startY, width, height, eqpInfo, fontSize)
{
    var x = parseFloat(startX) + parseFloat(fontSize) * 0.1 + width * 0.5;
    var y = parseFloat(startY) + parseFloat(fontSize) * 1.2 + height + 2 ;
    var eqpId = eqpInfo.eqpStatus.eqpId;
    var text = ' ' + eqpId;
    var alignment = 'middle';
    
    DRAW_SVG_TEXT(parentId, eqpId, x, y, text, alignment, fontSize, 'eqpId');
}


function DRAW_SVG_STATE_CHG_TIME_TEXT(parentId, startX, startY, width, height, eqpInfo, fontSize)
{
    var text = ' ';
    if( eqpInfo.eqpStatus.stateChgTime4Text != null && eqpInfo.eqpStatus.stateChgTime4Text != ""){
        text += eqpInfo.eqpStatus.stateChgTime4Text;
    }

    // if( eqpInfo.eqpStatus.e10State == 'PRD' || eqpInfo.eqpStatus.e10State == "SBY"){
    //     // return;
    // }

    var x = parseFloat(startX) + parseFloat(fontSize) * 0.1 + width * 0.5;
    var y = parseFloat(startY) + height * 0.5;
    var eqpId = eqpInfo.eqpStatus.eqpId;
    var alignment = 'middle';
    
    DRAW_SVG_TEXT(parentId, eqpId, x, y, text, alignment, fontSize, 'stateChgTime');
}


function DRAW_SVG_EQP_ID_TEXT2(parentId, startX, startY, width, height, eqpInfo, fontSize)
{
    var eqpId = eqpInfo.eqpStatus.eqpId;
    var lotCntText = ' ' + eqpId;
        
    var $rect = createSvg('text', {  
        'x': parseFloat(startX) + parseFloat(fontSize) * 0.1 + width * 0.5  ,
        'y': parseFloat(startY) + parseFloat(fontSize) * 1.2 + height,
        'id': eqpId + '_text_eqpId',  
        'name': eqpId + '_text_eqpId',  
        'fill': '#000', 
        'fill' : '#000000'             ,
        'font-family' : g_fontFamily   ,
        'font-size' : fontSize         ,
        'stroke' : '#000'              ,
        'stroke-dasharray' : 'null'    ,
        'stroke-linecap' : 'null'      ,
        'stroke-linejoin' : 'null'     ,
        'stroke-width' : '0'           ,
        'text-anchor' : 'middle'       ,
        'xml:space' : 'preserve'       ,
    }).appendTo($('#'+parentId+' svg g'));    
 
    $('#'+parentId+' #'+ eqpId +'_text_eqpId').html( lotCntText );
}

function drawTextByID(id,showText,point,fontSize){
    createSvg('text', {
        'x': point.x,
        'y': point.y,
        'id': id,
        'name': id,
        'fill': '#000000',
        'font-family': g_fontFamily,
        'font-size': fontSize,
        'stroke': '#000',
        'stroke-dasharray': 'null',
        'stroke-linecap': 'null',
        'stroke-linejoin': 'null',
        'stroke-width': '0',
        'text-anchor': 'middle',
        'xml:space': 'preserve',
    }).appendTo($('#' + g_currentZoneId + ' svg g'));
    d3.select('#' + g_currentZoneId + ' #' + id ).text(showText);
}
function showTextInfo(textIdMap,eqpInfos){
    $.each(textIdMap, function (index, node) {
        var tmpEqpInfo = null;
        var eqpChamberStatusList = [];
        for(var kk = 0; kk < eqpInfos.length; ++ kk)
        {
            var info = eqpInfos[kk];
            if( node.id.indexOf(info.eqpStatus.eqpId) != -1){
                var currentPoint = { x: node.x + 6.5, y: node.y + 1 };
                var shape = document.getElementById(node.id);
            	if (shape != null) {
            		shape.remove();
            	}
				getTransformPoint(node.transform,currentPoint);
                if(node.id === info.eqpStatus.eqpId +'_W'){//
                     drawTextByID(node.id,info.wipCnt,currentPoint,5);
                }
                else if(node.id === info.eqpStatus.eqpId +'_L'
                                     && info.inprocessLotIds.length > 0){
                     var inprocessLotIds = info.inprocessLotIds;
                     var ipLotIs = '';
                     for(var i = 0; i< info.inprocessLotIds.length; i++){
                         ipLotIs += inprocessLotIds[i] + ' ';
                     }
                     drawTextByID(node.id,ipLotIs,currentPoint,5);
                }
                else if(node.id === info.eqpStatus.eqpId +'_S'){
                     drawTextByID(node.id,info.eqpStatus.stateChgTime4Text,currentPoint,5);
                }
                else if(node.id === info.eqpStatus.eqpId +'_ID'){
                     drawTextByID(node.id,info.eqpStatus.eqpId,currentPoint,6);
                }
                else{
                     eqpChamberStatusList = info.eqpChamberStatusList;
                     for( var i = 0; i < eqpChamberStatusList.length; ++i){
                          if(node.id === eqpChamberStatusList[i].processId + '_ID'){
                              drawTextByID(node.id,eqpChamberStatusList[i].chamberId,currentPoint,5);
                              break;
                          }
                     }
                }
                break;
            }
       }
    });
}
 /////////////////////////////////////////
function showAllEqpPortCh(parentId, eqpIdList, eqpInfos, isEqpZone)
{
    isEqpZone = true;
    var pathIdMap = [];
    var pathIdList = [];
    var eqpRegex = /^E/;
    $.each($( "#" + parentId + " path"), function (index, path) {
        if( eqpIdList.includes($(this).attr("id"))){
            pathIdMap.push(
                {
                    'id':$(this).attr("id"),
                    'path':$(this).attr("d"),
                }
            );
            $(this).attr("name", $(this).attr("id"));
            pathIdList.push($(this).attr("id"));
        }
    });
    // pathIdList=['E_EG1V_02','E_ASC_01','E_EGMC_01'];
    if(pathIdList.length == 0 ){
        return;
    }
    $.each($( "#" + parentId + " text"), function (index, path) {
//NX        if (eqpRegex.test($(this).attr("id"))) {
            var cp = { x: Number.parseFloat($(this).attr("x")), y: Number.parseFloat($(this).attr("y")) };
            transformPoint(path,cp);
            g_textIdMap.push({
            'id':$(this).attr("id"),
            'x':cp.x,
            'y':cp.y,
//            'transform':$(this).attr("transform")
            });
//NX       }
    });
    showTextInfo(g_textIdMap,eqpInfos);
    var i = pathIdList.length - 1;
    for( ; i >= 0; --i){
        if( pathIdList[i].substr(0, 5) == "AREA_" ){
            pathIdMap.splice(i,1);
            pathIdList.splice(i,1);
        }
    }
    $.each(pathIdMap, function (index, node) {
        var portList = [];
        var eqpChamberStatusList = [];
        var tmpEqpInfo = null;
        var nodeId = node.id.replaceAll(' ', '').replaceAll('.', '_');
        for(var kk = 0; kk < eqpInfos.length; ++ kk)
        {
            var info = eqpInfos[kk];
            if( node.id == info.eqpStatus.eqpId){
                tmpEqpInfo = info;
                portList = info.eqpPortStatusList;
                eqpChamberStatusList = info.eqpChamberStatusList;
                if( parentId != 'FabViewZone'){
                    info.eqpArea_divIds.push(parentId);
                }
                break;
            }
        }
        //Port information Setting
        for( var i = 0; i < portList.length; ++i){
            var port = portList[i];
            var portElement = document.getElementById(port.mcpPortID);
            if (portElement == null) {
                continue;
            }
//            d3.select('#' + g_currentZoneId + ' #' + port.mcpPortID).style("fill", port.portStateColor);
//            d3.select('#' + g_currentZoneId + ' #' + port.mcpPortID).style("stroke", port.portStateColor);
            var bbox = portElement.getBBox();
            var cp = { x: bbox.x, y: bbox.y };
            transformPoint(portElement,cp);
            var width  = bbox.width;
            var height = bbox.height;
            var portIDName = port.mcpPortID +'_name';
			createSvg('text', {
				'x': cp.x + width/2,
				'y': cp.y + height/1.5,
				'id': portIDName,
				'name': portIDName,
				'fill': '#000000',
				'font-family': g_fontFamily,
				'font-size': 2,
				'stroke': '#000',
				'stroke-dasharray': 'null',
				'stroke-linecap': 'null',
				'stroke-linejoin': 'null',
				'stroke-width': '0',
				'text-anchor': 'middle',
				'xml:space': 'preserve',
			}).appendTo($('#' + g_currentZoneId + ' svg g'));
			$('#' + g_currentZoneId + ' #' + portIDName).html(port.portId);
        }
//       var width;
//       var height;
//       var cx;
//       var cy;

//       var path = node.path;
//       var arryM = path.toUpperCase().split('M');
//       if( arryM[1].includes('L')){
//            var arryL = arryM[1].split('L');
//            var X_Y=arryL[0].split(",");
//            if( X_Y.length == 1){
//                X_Y=arryH[0].split(" ");
//            }
//
//            cx = parseFloat(X_Y[0]);
//            cy = parseFloat(X_Y[1]);
//            width = parseFloat(arryL[1].split(",")[0]);
//            height = parseFloat(arryL[2].split(",")[1]);
//        }else{
//            var arryH = arryM[1].split('H');
//            var X_Y=arryH[0].split(",");
//            if( X_Y.length == 1){
//                X_Y=arryH[0].split(" ");
//            }
//
//            // console.log(" arryM = " + arryM + "  =======  arryH : " + arryH);
//            var arryV = arryH[1].split("V");
//            width = parseFloat(arryV[0]);
//            height = parseFloat(arryV[1]);
//            cx = parseFloat(X_Y[0]);
//            cy = parseFloat(X_Y[1]);
//
//            if(path.includes('H') && (width > cx )){
//                // debugger;
//                var x0 = path.indexOf('H');
//                var x1 = path.toUpperCase().indexOf('V');
//                if( x0 < x1){
//                    width -= cx;
//                }
//            }
//            if(path.includes('V') && (height > cy )){
//                // debugger;
//                height -= cy;
//            }
//        }

        // M43.06285,83.92553L63.66791,0L0,96.62603L-63.66791,0L0,-96.62603Z
        // M 21.339617,56.163188 H 16.04662 V 25.447787 H -16.04662 Z

//        var bbox = document.getElementById(node.id).getBBox();
//        var width  = bbox.width;
//        var height = bbox.height;
//        var cx = bbox.x;
//        var cy = bbox.y;
//
//        var r =  parseInt( (width>height?height:width) / 6 / 2 );
//        if( r < 3 ){
//            r = 1 ;
//        }
//
//        if(r > 6 ){
//            r = 6;
//        }
//        for( var i = 0; i < portList.length; ++i){
//            var $circle = createSvg('circle', {
//                'cx': cx - r * 1.7,
//                'cy': cy + r + i * r * 2.5,
//                'r': r,
//                'id':  nodeId+ '_' + portList[i].portId,
//                'name': nodeId + '_' + portList[i].portId,
//                'fill': portList[i].portStateColor,
//                // 'stroke-width': '0.5',
//                // 'stroke': '#000',
//            }).appendTo($('#'+parentId+' svg g'));
//        }
//
//        var colCnt = 3;
//
//        var startX = cx;
//        var startY = cy - 2;
//
//        var chamberStrokeColor = 'null';
//        var chamberStrokeWidth = 'null';
//        if( isEqpZone ){
//            chamberStrokeColor = '#000';   // 边框颜色.
//            chamberStrokeWidth = '1.5';
//        }
//
//        for( var i = 0; i < eqpChamberStatusList.length; ++i){
//
//            var post = GET_START_XY_03(startX, startY, width, height, colCnt, i + 1 , eqpChamberStatusList.length )
//
//            var $rect = createSvg('rect', {
//                'x': post.startX - 1,
//                'y': post.startY,
//                'height': post.c,
//                'width': post.c,
//                'id': nodeId + '_' + eqpChamberStatusList[i].processId,
//                'name': nodeId +'_' + eqpChamberStatusList[i].processId,
//                'fill': eqpChamberStatusList[i].eqpStateIdColor,
//                'stroke-width': chamberStrokeWidth,
//                'stroke': chamberStrokeColor,
//            }).appendTo($('#'+parentId+' svg g'));
//        }
//
//		var r0 = width>height?height:width;
//		var fontSize0 = (r0 / 12 + 3 );
//
//		if( width > height * 1.5 ){
//			fontSize0 = fontSize0 + 3;
//		}else if ( width > height * 1.2 ){
//			fontSize0 = fontSize0 + 2;
//		}
//
//        fontSize0 = parseInt(fontSize0)
//
//		if( fontSize0 < 7   ){
//			fontSize0 = 2
//		}
//		if( fontSize0 > 12){
//			fontSize0 = 12;
//		}

//        if(isEqpZone){
//            console.log("eqpId2: " + nodeId + ", width: " + width + ", height: " + height + ", fontSize0: " + fontSize0);
//            DRAW_SVG_LOT_CNT_TEXT(parentId, startX, startY, tmpEqpInfo, fontSize0 );   // 11
//            DRAW_SVG_LOT_ID_TEXT(parentId, startX, startY, tmpEqpInfo, fontSize0 - 1);   // 8
//            DRAW_SVG_EQP_ID_TEXT(parentId, startX, startY, width, height, tmpEqpInfo, fontSize0 + 2 );  // 8
//            DRAW_SVG_STATE_CHG_TIME_TEXT(parentId, startX, startY, width, height, tmpEqpInfo, fontSize0 );  // 11
//        }

        $("#FabViewZone svg #" + nodeId).on("click", function (arg0) {
            var tmpEqpInfo = null;
            for(var kk = 0; kk < g_eqpInfoList.length; ++ kk)
            {
                var info = g_eqpInfoList[kk];
                if( nodeId == info.eqpStatus.eqpId){
                    tmpEqpInfo = info;
                    break;
                }
            }

            console.log(" eqpId : " + nodeId);
            console.log(" tmpEqpInfo.eqpStatus.curStateId : " + tmpEqpInfo.eqpStatus.curStateId);
            console.log(" tmpEqpInfo.wipCnt : " + tmpEqpInfo.wipCnt);

            if( tmpEqpInfo.eqpStatus.curStateId == 'DOWN'){
                // 显示机台的状态切换历史记录
               // startEqpStatusChangeHis("#FabViewZone svg #" + nodeId,  node.id);

            } else  if( tmpEqpInfo.wipCnt > 0 ){
                // 显示 wipList
               // startShowWipInfo("#FabViewZone svg #" + nodeId,  node.id);

            // }else{
                // startEqpStatusChangeHis("#FabViewZone svg #" + nodeId,  node.id);
            }
        });
        // 鼠标右键事件
        $("#FabViewZone svg #" + nodeId).contextmenu(function(e) {
            return showMenuEqpt_(e,nodeId);
        });
    });
    
    // d3.select('#FabViewZone  #EV_F01').style("fill", 'BLUE');
    // d3.select('#div_parentAreaId_AREA_CVD  #EV_D01').style("fill", 'red');
    return pathIdList;
}
function showMenuEqpt_(e,nodeId){
	// 获取窗口尺寸
	var winWidth = $(document).width();
	var winHeight = $(document).height();
	// 鼠标点击位置坐标
	var mouseX = e.pageX;
	var mouseY = e.pageY;
	// ul标签的宽高
	var menuWidth = $(".contextmenu").width();
	var menuHeight = $(".contextmenu").height();
	// 最小边缘margin(具体窗口边缘最小的距离)
	var minEdgeMargin = 10;
	// 以下判断用于检测ul标签出现的地方是否超出窗口范围
	// 第一种情况：右下角超出窗口
	if (mouseX + menuWidth + minEdgeMargin >= winWidth &&
		mouseY + menuHeight + minEdgeMargin >= winHeight) {
		menuLeft = mouseX - menuWidth - minEdgeMargin + "px";
		menuTop = mouseY - menuHeight - minEdgeMargin + "px";
	}
	// 第二种情况：右边超出窗口
	else if (mouseX + menuWidth + minEdgeMargin >= winWidth) {
		menuLeft = mouseX - menuWidth - minEdgeMargin + "px";
		menuTop = mouseY + minEdgeMargin + "px";
	}
	// 第三种情况：下边超出窗口
	else if (mouseY + menuHeight + minEdgeMargin >= winHeight) {
		menuLeft = mouseX + minEdgeMargin + "px";
		menuTop = mouseY - menuHeight - minEdgeMargin + "px";
	}
	// 其他情况：未超出窗口
	else {
		menuLeft = mouseX + minEdgeMargin + "px";
		menuTop = mouseY + minEdgeMargin + "px";
	};
	var tmpEqpInfo = null;
	for (var kk = 0; kk < g_eqpInfoList.length; ++kk) {
		var info = g_eqpInfoList[kk];
		if (nodeId == info.eqpStatus.eqpId) {
			tmpEqpInfo = info;
			break;
		}
	}

	$("#eqp_id").html(sessionStorage.getItem("wfm.contextmenu.eqpId") + nodeId);         //sessionStorage.getItem('')
	$("#eqp_name").html(tmpEqpInfo.eqpStatus.eqpName);
	$("#status").html(sessionStorage.getItem("wfm.contextmenu.status") + tmpEqpInfo.eqpStatus.e10State);
	$("#mode").html(sessionStorage.getItem("wfm.contextmenu.mode") + tmpEqpInfo.eqpStatus.eqpMode);
	//replace href eqp id    
	var inprlist = "javascript:window.open('api/wfmWfviewEqpt#tab=inprlist&eqptid=" + nodeId + "','_blank','width=900,height=600,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no');void(0);";
	var waitlist = "javascript:window.open('api/wfmWfviewEqpt#tab=waitlist&eqptid=" + nodeId + "','_blank','width=900,height=600,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no');void(0);";
	var alarmlist = "javascript:window.open('api/wfmWfviewEqpt#tab=alarmlist&eqptid=" + nodeId + "','_blank','width=900,height=600,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no');void(0);";
	$("#inprlist").attr('href', inprlist);
	$("#inprlist").html(sessionStorage.getItem("wfm.contextmenu.inprlist"));
	$("#waitlist").attr('href', waitlist);
	$("#waitlist").html(sessionStorage.getItem("wfm.contextmenu.waitlist"));
	$("#alarmlist").attr('href', alarmlist);
	$("#alarmlist").html(sessionStorage.getItem("wfm.contextmenu.alarmlist"));
	// ul菜单出现
	$(".contextmenu").css({
		"left": menuLeft,
		"top": menuTop,
		"position": "absolute"
	}).show();
	// 阻止浏览器默认的右键菜单事件
	return false;
}

function createSvg(tag, attr) {  
    if(!document.createElementNS) return;//防止IE8报错  
    var $svg = $(document.createElementNS('http://www.w3.org/2000/svg', tag));  
    for(var key in attr) {
        switch(key) {
            case 'xlink:href'://文本路径添加属性特有
                $svg[0].setAttributeNS('http://www.w3.org/1999/xlink', key, attr[key]); 
            break;
            default:
            $svg.attr(key, attr[key]);  
        }
    }  
   return $svg;  
}; 


// id="text_lotCnt_'+eqpId;  
// id="text_eqpId_'+eqpId;  

// d3.select('#FabViewZone  #CYEQP01').style("fill", 'RED');
// d3.select('#FabViewZone  #CYEQP01_P2').style("fill", 'RED');
// d3.select('#FabViewZone  #EV_D01_R1').style("fill", 'BLUE');

// d3.select('#div_parentAreaId_AREA_CVD  #EXP05_P1').style("fill", 'BLUE');
// d3.select('#div_parentAreaId_AREA_CVD  #EV_D01').style("fill", 'BLUE');

// d3.select('#svg_eqp_AREA_CLEAN  #COEQP02').style("fill", 'BLUE');

// d3.select('#svg_eqp_AREA_CLEAN  #CH02').style("fill", 'BLUE');

// d3.select('#svg_eqp_AREA_CLEAN  #CH02_text_lotCnt').style("fill", 'BLUE');
// d3.select('#svg_eqp_AREA_CLEAN  #CH02_text_lotCnt').html("aaa");
// d3.select('#svg_eqp_AREA_CMP    #EV_20_M1').style("fill", 'BLUE');

//  d3.select('#' + g_currentZoneId + ' #COEQP02_P3').style("fill", 'RED');


function refreshAllEqpStatus(colorMap)
{
    if( g_eqpInfoList == null || g_eqpInfoList.length == 0){
        console.log("g_eqpInfoList == null || g_eqpInfoList.length == 0, then return ");
        return;
    }
    if( g_eqpZoneList == null || g_eqpZoneList.length == 0){
        console.log("g_eqpZoneList == null || g_eqpZoneList.length == 0, then return ");
        return;
    }
    
    var eqpStatusArr = []; 
    $.each( colorMap.COLOR_EQP_STATE_BG, function(index, c){
        var stateId = c.item;
        if( stateId.includes('.')){
            stateId = stateId.slice(stateId.lastIndexOf('.') + 1 ,stateId.length);
        }
        eqpStatusArr.push(
        {
            "id":stateId,
            "cnt":0
        });
    });
    
    for(var i = 0; i < g_eqpZoneList.length ; i ++){
        if( g_currentZoneId == g_eqpZoneList[i].viewId ){
            var eqpIdList = g_eqpZoneList[i].eqpIds;
            if( eqpIdList == null || eqpIdList.length == 0){
                console.log("eqpIdList == null || eqpIdList.length == 0, then return ");
                continue;
            }
            for(var j = 0; j < eqpIdList.length; ++j ){
                for(var k = 0; k < g_eqpInfoList.length; ++k ){
                    if( eqpIdList[j] == g_eqpInfoList[k].eqpStatus.eqpId ){
                        refreshEqpStatus(g_currentZoneId, g_eqpInfoList[k], eqpStatusArr);
                    }
                }
            }
            break;
        }
    }
    var html = "";
    for(var i = 0; i < eqpStatusArr.length; ++i){
        if(i > 0){
            html += ", "
        }
        html += eqpStatusArr[i].id + ": " + eqpStatusArr[i].cnt;
    }
    $("#eqp_status_cnt").html(html);
}


function refreshEqpStatus( currentZoneId, eqpInfo, eqpStatusArr )
{
    var eqpId = eqpInfo.eqpStatus.eqpId.replaceAll(' ', '').replaceAll('.', '_');
    d3.select('#' + currentZoneId + ' #' + eqpId ).style("fill", eqpInfo.eqpStatus.curStateIdColor );
//    d3.select('#' + currentZoneId + ' #' + eqpId ).style("stroke", eqpInfo.eqpStatus.eqpCategoryColor );
    d3.select('#' + currentZoneId + ' #' + eqpId ).style("stroke", eqpInfo.eqpStatus.eqpModeColor );
    
    var cnt = 1;
    var haveFind = 0;
    if(eqpStatusArr.length > 0){
        for(var i = 0; i < eqpStatusArr.length; ++i){
            if(eqpStatusArr[i].id == eqpInfo.eqpStatus.curStateId){
                cnt = eqpStatusArr[i].cnt + 1;
                eqpStatusArr.splice(i, 1, {
                                        "id":eqpInfo.eqpStatus.curStateId,
                                        "cnt":cnt
                                      });
                haveFind = 1;
                break;
            }
        }
    }
    
    if(haveFind == 0){
        eqpStatusArr.push(
        {
            "id":eqpInfo.eqpStatus.curStateId,
            "cnt":cnt
        });
    }
    //Port color refresh
    $.each(eqpInfo.eqpPortStatusList, function (index, portStatus) {
        try{
//            d3.select('#' + currentZoneId + ' #' + eqpId + '_' + portStatus.portId).style("fill", portStatus.portStateColor );
            d3.select('#' + currentZoneId + ' #' + portStatus.mcpPortID).style("fill", portStatus.portStateColor);
            d3.select('#' + currentZoneId + ' #' + portStatus.mcpPortID).style("stroke", portStatus.portStateColor);
        }catch(error){
            console.log("-----ID = " + '#' + currentZoneId + ' #' + eqpId + '_' + portStatus.portId );
			console.log("refreshEqpStatus happend error, msg001 : " + error );
        }
    });
    //Chamber color refresh
    try{
        $.each(eqpInfo.eqpChamberStatusList, function (index, chamberStatus) {
            d3.select('#' + currentZoneId + ' #' + chamberStatus.processId).style("fill", chamberStatus.eqpStateIdColor );
            $("#FabViewZone svg #" + chamberStatus.processId).contextmenu(function(e) {
                eqpInfo.eqpStatus.eqpName=chamberStatus.eqpName;
                return showMenuEqpt_(e,eqpInfo.eqpStatus.eqpId);
            });
        });
    }catch(error){
        console.log("-----ID = " + '#' + currentZoneId + ' #' + eqpId + '_' + chamberStatus.processId );
        console.log("refreshEqpStatus happend error, msg002 : " + error );
    }

    //
//    var text = ' ' + eqpInfo.wipCnt;
//    var keyId = 'lotCnt';
//    var parentId = currentZoneId;
//
//    d3.select('#'+parentId+' #'+ eqpId +'_text_' + keyId ).style("fill", eqpInfo.eqpStatus.fontColor );
//    d3.select('#'+parentId+' #'+ eqpId +'_text_' + keyId ).style("stroke", eqpInfo.eqpStatus.fontColor );
//    d3.select('#'+parentId+' #'+ eqpId +'_text_' + keyId ).html( text );
//
//    text = ' ';
//    if( eqpInfo.eqpStatus.stateChgTime4Text != null && eqpInfo.eqpStatus.stateChgTime4Text != ""){
//        text += eqpInfo.eqpStatus.stateChgTime4Text;
//    }
//    //
//    keyId = 'stateChgTime';
//
//    d3.select('#'+parentId+' #'+ eqpId +'_text_' + keyId ).style("fill", eqpInfo.eqpStatus.fontColor );
//    d3.select('#'+parentId+' #'+ eqpId +'_text_' + keyId ).style("stroke", eqpInfo.eqpStatus.fontColor );
//    d3.select('#'+parentId+' #'+ eqpId +'_text_' + keyId ).html( text );
//
//    text = '  ';
//    if( eqpInfo.inprocessLotIds != null && eqpInfo.inprocessLotIds.length > 0 ){
//        text = eqpInfo.inprocessLotIds[0];
//    }
//    keyId = 'lotId';
//    d3.select('#'+parentId+' #'+ eqpId +'_text_' + keyId ).html( text );

    // 要更新 DRAW_SVG_LOT_CNT_TEXT 
    // DRAW_SVG_LOT_ID_TEXT 
    // DRAW_SVG_EQP_ID_TEXT 
    // DRAW_SVG_STATE_CHG_TIME_TEXT 

}

function refreshSvgHeader( colorMap )
{
    var colorEqpStateList_BG = colorMap.COLOR_EQP_STATE_BG;
    var colorEqpStateList_FG = colorMap.COLOR_EQP_STATE_FG;
    var prefix =  "HEARD_SVG_COLOR_";  

    var parentId = 'div_HeaderViewZone';

    $.each(colorEqpStateList_BG, function (index, colorEqpState) {
        var item = colorEqpState.item;
        var fillColor = colorEqpState.color;
        var headerId = prefix + item.replaceAll(' ', '').replaceAll('.', '_');
        d3.select('#'+parentId+' #'+ headerId ).style("fill", fillColor );

        var fontColor = '#000';
        for(var i = 0; i < colorEqpStateList_FG.length; ++ i ){
            if( item == colorEqpStateList_FG[i].item){
                fontColor = colorEqpStateList_FG[i].color;
                break;
            }
        }

        var fontId = 'text_heard_svg_' + item.replaceAll(' ', '').replaceAll('.', '_');
        d3.select('#'+parentId+' #'+ fontId ).style("fill", fontColor );
        d3.select('#'+parentId+' #'+ fontId ).style("stroke", fontColor );
    });

}


//////////////////////////
//////////////////////////
//////////////////////////

function start_drawSvgHeader(colorMap)
{
    var colorEqpStateList = colorMap.COLOR_EQP_STATE_BG;
    drawSvgHeader(colorEqpStateList);
}


function drawSvgHeader_block(prefix, index, colorEqpState, wordLen)
{
    var item = colorEqpState.item;
    var fillColor = colorEqpState.color;

    var headerId = prefix + item.replaceAll(' ', '').replaceAll('.', '_');
    // var fillColor = "red";
    // var boxWidth = 50;  
    
    var boxWidth = wordLen * 13;
    
    var boxHeight = 30;
    var offsetX = 6;
    var offsetY = 7;

    var x = 1 + offsetX + index * (boxWidth + 8);
    var y = 1 + offsetY;

    var pathData    = 'm'+x+','+y+'l'+boxWidth+',0l0,'+boxHeight+'l-'+boxWidth+',0l0,-'+boxHeight+'z';
    var strokeWidth = "0"
    var strokeColor = "null";

    var str = '<path id="'+headerId + '" name="' + headerId +'" fill="'+fillColor+'" d="'+pathData+'" \
    stroke-width="'+strokeWidth+'" stroke-linejoin="undefined" stroke-linecap="undefined" \
    stroke="'+strokeColor+'" /> '

    var fontSize = 13;
    var startX = boxWidth/2 + x;
    var startY = 15+7 - 1 + y ;

    var textId = 'text_heard_svg_' + item.replaceAll(' ', '').replaceAll('.', '_');
    var text = item;
    if( text.includes('.')){
        text = text.slice(text.lastIndexOf('.') + 1 ,text.length);
    }

    str  += '<text fill="#000" font-family="'+g_fontFamily+'" font-size="'+fontSize+'" id="'+textId+'" stroke="#000" ' 
    + 'stroke-dasharray="null" stroke-linecap="null" stroke-linejoin="null" stroke-width="0" text-anchor="middle"  '
    + ' x="'+startX+'" xml:space="preserve" y="'+startY+'">'+text+'</text> ' ;

    return str;
}

function drawSvgHeader_backGroud(prefix, cnt, wordLen)
{
    var item = 'backGroud';
    var fillColor = '#CEF';

    var headerId = prefix + item;
    // var fillColor = "red";
    // var boxWidth = (50 + 8 ) * cnt + 6 ;
    var boxWidth = ( wordLen * 15 -2 ) * cnt + 6 ;
    var boxHeight = 45;

    var x = 1; // + index * (boxWidth + 16);
    var y = 1;

    var pathData    = 'm'+x+','+y+'l'+boxWidth+',0l0,'+boxHeight+'l-'+boxWidth+',0l0,-'+boxHeight+'z';
    var strokeWidth = "0"
    var strokeColor = "null";

    var str = '<path id="'+headerId + '" name="' + headerId +'" fill="'+fillColor+'" d="'+pathData+'" \
    stroke-width="'+strokeWidth+'" stroke-linejoin="undefined" stroke-linecap="undefined" \
    stroke="'+strokeColor+'" /> '

    return str;
}


function  drawSvgHeader( colorEqpStateList )  
{
    var wordLen = 6;
    var width = wordLen * 15 * (colorEqpStateList.length ) - 2 * colorEqpStateList.length ;
    var html = GET_SVG_HEADER("div_HeaderViewZone", 0, 0, 
            width, 35 + 10, 1, 1, null) + GET_SVG_DEFS_START() ; 
    var prefix =  "HEARD_SVG_COLOR_";     
    html += GET_SVG_DEFS_END(); 

    html += drawSvgHeader_backGroud(prefix, colorEqpStateList.length, wordLen);


    $.each(colorEqpStateList, function (index, colorEqpState) {
        var str = drawSvgHeader_block(prefix, index, colorEqpState, wordLen);
        html += str;
    });

    // middle;

    var scaleX = "1";
    var scaleY = "1";
    var x = "0";
    var y = "0";

    $.each(colorEqpStateList, function (index, colorEqpState) {
        var itemId = prefix + colorEqpStateList[0].item.replaceAll(' ', '').replaceAll('.', '_');;
        html += 
        '<g id="'+itemId+'" transform="matrix( '+scaleX+',  0,  0,  '+scaleY+',  '+x+', '+y+') "> \
            <g id="stat" transform="matrix( 1,  0,  0,  1,  0, 0) "> \
                <g transform="matrix( 1,  0,  0,  1,  0, 0) "> \
                    <use xlink:href="#'+itemId+'_Layer0"/>\
                </g>\
            </g>\
        </g>';
        
    });

    html += '</svg> </div>'; 

    $("#HeaderViewZone").html(html);

}


function startShowWipInfo(pathId,  eqpId)
{
    var w = document.documentElement.clientWidth;
    w = w /2;
    if( w < 1200){
        w = 1200;
    }
    
    if(w > 2500){
        w = 2500;
    }
    
    $("#modal-dialog").css("width", w + "px");
    
    $("#modal-dialog-title").html('WIP list for ' + eqpId);
    
    $("#grouplist").children("tbody").empty();

    $("#modal-addGroup").modal("show");

	$.ajax({
		url : "api/listWips",
		type : 'POST',
		beforeSend: function(request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
		data:{eqpId: eqpId, lotType: g_lotType},
		success : function(data) {
			$("#grouplist").children("tbody").empty();
			$('#grouplist').DataTable().clear();
			$('#grouplist').DataTable().destroy();
                
                $.each(data,function(index, item) 
                {
                    // var stateChgTime = item.stateChgTime;
                    // if(stateChgTime == null){
                    //     stateChgTime = "";
                    // }else if(stateChgTime.length > 19){
                    //     stateChgTime = stateChgTime.substr(0, 19);
                    // }

                    $('#grouplist').children("tbody").append("<tr><td><input type='checkbox' class='minimal' /></td><td>"
                                            + item.priority
                                            + "</td><td>"
                                            + item.lotId
                                            + "</td><td>"
                                            // + item.customerId
                                            // + "</td><td>"
                                            + item.prodspecId
                                            + "</td><td>"
                                            + item.pdName
                                            + "</td><td>"
                                            + item.lotProcessState
                                            + "</td><td>"
                                            + item.qt
                                            + "</td><td>"
                                            + item.lotType
                                            // + "</td><td style='min-width:180px !important'>"
                                            // + stateChgTime
                                            // + "</td><td>"
                                            // + item.lotProcessState
                                            + "</td></tr>" );
                });



				// $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
				//       checkboxClass: 'icheckbox_minimal-blue',
				//       radioClass   : 'iradio_minimal-blue'
				// });

				$('#grouplist tbody tr ').on('click',function(){
					$('#grouplist tbody tr ').removeClass("active");
					$('#grouplist tbody tr ').removeClass("info");
					$(this).addClass("info");
                });
                
                $('#grouplist tr').find('td:eq(0)').hide();
                // $('#grouplist thead tr ').hide()
                $('#grouplist tr').find('th:eq(0)').hide();

                // $('#grouplist thead').hide()
				

				$('#grouplist').on('page.dt',function (){
				// 	$("#selectAll").prop("checked",false);
				// 	$("#selectAll").parent().removeClass("checked").attr("aria-checked",false);
				// 	$("#grouplist tbody input[type='checkbox']").each(function(){
				// 		$(this).prop("checked",false);
				// 		$(this).parent().removeClass("checked").attr("aria-checked",false);
				// 	});
                }).DataTable();
                
                
                // $("#grouplist").dataTable(
                //     {
                //         autoWidth: false,//自动适应宽度
                //         searching: false,//搜索框
                //         destroy: true,//是否销毁
                //         ordering: false,//是否排序
                //         oLanguage:{
                //             sInfo:       "Showing _START_ to _END_ of _TOTAL_ rows",
                //             sLengthMenu: "Show _MENU_ rows",
                //         }
                //     }
                // );

			
			$('#databox').show();
			
			//Select All
			$("#selectAll").siblings(":first").click(function(){
				// $("#grouplist tbody input[type='checkbox']").each(function(){
				// 	$(this).prop("checked",false);
				// 	$(this).parent().removeClass("checked").attr("aria-checked",false);
				// 	$(this).prop("checked",$("#selectAll").prop("checked"));
				// 	if($("#selectAll").prop("checked") == true){
				// 		$(this).parent().addClass("checked").attr("aria-checked",true);
				// 	}
				// });
            });

            $("#databox").css("width", "100%");
            $("#grouplist").css("width", "100%");

            //var refreshBtnText = sessionStorage.getItem("wfm.refresh");
            // showLotTypeSelect("grouplist", refreshBtnText);

            // $('#grouplist thead tr ').hide()
		}});
}

// noUse 在Wip信息页面显示 WIP下拉框. 
function showLotTypeSelect(grouplist, refreshBtnText)
{
    var grouplistId = "#" + grouplist + "_length";
    var lotTypeId =  grouplist + "_lotTypeSelect";

    try {
        parentDiv.children("div #div_lotTypeId").remove();
    } catch (error) {
    }

    var parentDiv=$(grouplistId).parent().parent();

    parentDiv.children("div").removeClass("col-sm-6");
    parentDiv.children("div").children("div").removeClass("dataTables_filter");
    parentDiv.children("div").addClass("col-sm-4");

    var grouplistLotTypeHtml = '<div class="col-sm-4" id="div_lotTypeId"> \
            <div class="dataTables_filter"> <label>Lot Type: <select id="'+lotTypeId+'" class="form-control input-sm"> \
            <option value="All">All</option> \
            <option value="Production">Production</option> \
            <option value="Engineering">Engineering</option>\
            </select>\
            </label>  \
            <button id="refreshBtn" type="button" class="btn btn-info bi bi-arrow-counterclockwise">' + refreshBtnText + '</button>\
        </div></div>';

    parentDiv.append(grouplistLotTypeHtml);

    $("#"+lotTypeId).on("change", function(e){ 
        console.log("change: val:  " +  $("#"+lotTypeId).val());
    });

    $("#refreshBtn").on("click", function(e){ 
        console.log("Btn_click val:  " +  $("#"+lotTypeId).val());
    });
}

// 计算 WipCnt 值. 
function calculateWipCnt(eqpStatusList)
{
    $.each(eqpStatusList, function (index, eqpInfo) {
        var isListAll = (g_lotType == null || g_lotType == '' || g_lotType == 'All' );
        eqpInfo.wipCnt = 0;
        if( eqpInfo.wipCntList != null && eqpInfo.wipCntList.length > 0 ){
            for(var i = 0; i < eqpInfo.wipCntList.length; ++i){
                if( isListAll || eqpInfo.wipCntList[i].lotType == g_lotType ){
                      eqpInfo.wipCnt += eqpInfo.wipCntList[i].lotCount;  
                }
            }
        }
    });
}

function updateVehicleState(mcpInfo)
{
    var mcpFlag = false;
    var regex = /^VHC_\d{4}$/;   // 正则表达式，匹配 VHC_4 位数字
    var vehicleList = mcpInfo.vehicleList;
    var pathIdMap = [];
	$.each($("#" + g_currentZoneId + " path"), function(index, path) {
		if (mcpInfo.mcpName == $(this).attr("id")) {
			mcpFlag = true;
			return true;
		}
		if (regex.test($(this).attr("id"))) {
			var graphID = $(this).attr("id") + '_ID';
			var graphCar = $(this).attr("id")+ '_Car';
			var nameID = $(this).attr("id") + '_text';
			var carIDName = $(this).attr("id") + '_carID';
			pathIdMap.push(
            {
                'id':$(this).attr("id"),
                'd':$(this).attr("d"),
                'transform':$(this).attr("transform")
            });
			var shape = document.getElementById(graphID);
			if (shape != null) {
				shape.remove();
			}
			shape = document.getElementById(nameID);
			if (shape != null) {
				shape.remove();
			}
			shape = document.getElementById(carIDName);
			if (shape != null) {
				shape.remove();
			}
			shape = document.getElementById(graphCar);
            if (shape != null) {
                shape.remove();
            }
		}
	});
	if (mcpFlag == false) {
    	console.log("SVG map not found mcpName:" + mcpInfo.mcpName);
    	return;
    }
    //OHT color setting
    d3.select('#' + g_currentZoneId + ' #' + mcpInfo.mcpName).style("stroke", mcpInfo.fillColor);
    //Vehicle color setting
	$.each(vehicleList, function(index, vehicle) {
		$.each(pathIdMap, function(index, path) {
			if (path.id == "VHC_" + vehicle.currentLocation) {
				var graphID = path.id + '_ID';
				var graphCar = path.id + '_Car';
				var nameID = path.id + '_text';
				var carIDName = path.id + '_carID';
				var xx = 0;
				var yy = 0;
				//show vehicle graph
				var centerPoint = { x: 0, y: 0 };
				getTransformPoint(path.transform,centerPoint);
				getCenterPoint(path.d, centerPoint);
//				console.log(path.id + " 图形的对称中心坐标为:" + centerPoint.x + ", " + centerPoint.y);
				var r = 2
				var shape = document.getElementById(graphID);
				if (shape != null) {
					shape.remove();
				}
				shape = document.getElementById(graphCar);
                if (shape != null) {
                	shape.remove();
                }
				shape = document.getElementById(nameID);
				if (shape != null) {
					shape.remove();
				}
				shape = document.getElementById(carIDName);
				if (shape != null) {
					shape.remove();
				}
				//show vehicle graph
//                var d1 = "m 134.60944,75.321591 c -0.2246,1.2e-5 -0.40624,0.193813 -0.40622,0.432155 v 2.967236 h 1.69758 v 0.0038 h 2.88978 c 0.17331,6e-5 0.31312,-0.148902 0.313,-0.332802 v -1.036988 c 4e-5,-0.238344 -0.18147,-0.431182 -0.40623,-0.431193 h -2.79655 l -8.2e-4,0.0762 v -1.345673 c 7e-5,-0.183744 -0.14006,-0.332638 -0.31301,-0.332799 z m -10.4876,0.02991 c -0.17334,-6e-5 -0.31311,0.1489 -0.31303,0.332803 v 1.269465 h -2.79753 c -0.22461,2.34e-4 -0.40628,0.193981 -0.40625,0.432161 v 1.036023 c -1.2e-4,0.183746 0.14006,0.33264 0.31302,0.332802 h 2.89076 v -0.0038 h 1.69662 V 75.78377 c 0,-0.238345 -0.18179,-0.432148 -0.40626,-0.43216 z m 10.60046,0.399361 h 0.69081 v 1.664972 h 0.4867 8e-4 2.64935 v 0.887469 h -2.64935 -1.20104 v -0.887469 h 0.0225 z m -10.36985,0.03088 h 0.68979 v 1.664971 h 0.0225 v 0.88747 h -1.257 -2.59346 v -0.88747 h 2.59346 0.5436 z m 7.85785,0.109972 c -0.21588,1.71e-4 -0.42733,0.0562 -0.61525,0.163024 h 1.22656 c -0.18629,-0.105941 -0.39722,-0.161922 -0.61131,-0.163024 z m 0.61131,0.163024 c 0.39577,0.221902 0.64134,0.642211 0.64272,1.097762 6e-5,0.696097 -0.5616,1.25986 -1.25403,1.259821 -0.69241,3.9e-5 -1.25412,-0.563724 -1.25406,-1.259821 3.1e-4,-0.45443 0.24519,-0.874474 0.63881,-1.097762 h -1.3453 v 2.667235 h 3.94072 v -2.667236 z m -5.32329,-0.133119 c -0.2142,0.0011 -0.42399,0.05706 -0.61033,0.163029 h 1.22656 c -0.18798,-0.106883 -0.40023,-0.162917 -0.61623,-0.163029 z m 0.61623,0.163029 c 0.39353,0.223389 0.63759,0.643397 0.63782,1.097759 9e-5,0.696092 -0.56162,1.259856 -1.25405,1.259821 -0.69239,3.5e-5 -1.25409,-0.563729 -1.25404,-1.259821 0.002,-0.455562 0.24801,-0.87585 0.64371,-1.097759 h -1.36886 v 2.667232 h 3.93973 v -2.667233 z m -7.95208,3.051156 V 79.8998 h 5.35176 v 1.378471 h -4.72473 v 1.083294 12.377303 h 2.26668 1.07842 v 0.002 h 1.06954 v -0.715763 h -0.85954 l -0.0422,-10.311044 h 3.49227 v 1.371673 h -1.46108 v 2.176229 h 6.95412 v -2.176227 h -1.46601 v -1.347605 l 3.48245,0.01159 v -0.02013 h -3.48245 v -0.01463 h 3.48245 v 0.01463 h 0.0737 l 0.006,-0.730232 h -11.08228 l -0.003,-0.642448 v 0.642448 h -0.0197 v -0.65113 -0.003 h -0.92924 v 0.654026 0.260444 l 0.0142,10.749955 h -1.38846 V 82.999092 h -0.62407 v -0.636513 l -0.55932,-9.7e-4 h 0.55932 v -0.330873 h 16.99036 v 0.330873 h 0.50535 l -0.50535,0.02894 v 0.608688 h -0.66528 v 10.985345 h -1.34826 -0.002 -8.1e-4 l -0.0462,0.0078 0.0373,-8.737714 v 8.729999 h 0.009 V 82.999259 h 0.002 l -0.002,-0.613509 -8e-4,0.613509 h -8.2e-4 V 82.35688 h -0.92824 v 0.01931 h -0.0142 l 0.0142,9.7e-4 v 0.622192 h -0.009 v 11.015229 h -0.003 V 83.729583 h -0.003 l -0.0411,10.284998 h -0.78306 v 0.715764 h 0.78014 v 0.0038 h 0.0332 l -0.003,-0.0038 h 0.0197 v 0.0038 h -0.0142 l 0.006,0.0049 h 3.55507 V 81.278578 h -4.55496 v -1.378472 h 5.37233 V 79.13611 Z m 15.22117,3.863387 V 82.38472 l -8e-4,0.614476 z m 2.95651,-0.608686 v -9.7e-4 l -0.002,9.7e-4 z m -5.05246,4.871433 V 87.4973 h -6.9541 v -0.23537 h -0.97832 v 6.192029 h 8.98922 v -6.192025 z m -0.84584,-7.359242 h 1.00482 v 1.360144 h -1.00482 z m -6.0072,0.01352 h 1.00379 v 1.36111 h -1.00478 z m 1.94877,0.05402 h 3.14687 v 1.279111 h -3.14687 z m 7.93241,3.255662 h 0.006 l -0.006,1.499053 z m -7.70085,0.488108 h 2.3874 v 0.01243 h -0.15811 v 0.003 h 0.15811 v 1.356284 h -2.3874 z m 2.22939,0.01545 h -1.63376 l 1.63376,0.0049 z m -3.80036,3.499714 v -0.778471 h 5.53424 v 0.778464 m -0.17867,0.814157 h 1.16375 v 0.940526 h -0.003 v 3.764991 h -7.35155 v -3.747628 h -0.0197 v -0.940523 h 0.0197 v -0.0058 h 6.19169 z m 0,0.01159 v 0.608686 h 0.33362 v 0.320264 h 0.82621 v -0.92895 z m 0.33362,0.92895 h -0.33362 v -0.32033 h -5.04753 v 0.337626 h -0.36897 v 2.797457 h 0.40134 v 0.295182 h 4.99653 v -0.316397 h 0.35225 v -0.153371 h -5.7256 v -0.572994 h 5.7256 v -0.401292 h -5.73047 v -0.572034 h 5.73047 v -0.387786 h -5.72854 v -0.572994 h 5.72854 z m 0,0.133118 v 0.572992 h 0.003 v -0.573063 z m 0,0.960782 v 0.572033 h 8.1e-4 V 90.07776 Z m 0,0.973324 v 0.572997 h 0.006 v -0.572997 z m 0,0.726374 v 0.316403 h -0.35225 v 0.62412 h 1.16377 v -0.94052 z m -5.34878,0.316403 h -0.40134 v -0.295184 h -0.76242 v 0.939558 h 1.16376 z m -0.40134,-3.09264 v -0.337625 h 0.36897 v -0.602898 h -1.14416 v 0.940523 z";
//                var d0 = "m 109.66806,75.115574 c -0.22328,1.2e-5 -0.40318,0.196657 -0.40316,0.437838 v 3.001878 h 1.68781 v 0.0044 h 2.8731 c 0.17233,6.1e-5 0.31097,-0.150693 0.31086,-0.336797 v -1.049895 c 4e-5,-0.241172 -0.18118,-0.436357 -0.40453,-0.436369 h -2.77943 l -8.2e-4,0.07762 v -1.36183 c 7e-5,-0.185914 -0.13875,-0.336632 -0.31087,-0.336794 z m -10.426311,0.03074 c -0.172288,-6.4e-5 -0.310968,0.150722 -0.31087,0.336795 v 1.284222 h -2.780827 c -0.223132,2.37e-4 -0.404591,0.196797 -0.40456,0.437833 v 1.048459 c -9.8e-5,0.185945 0.14015,0.336636 0.312293,0.336798 h 2.873094 v -0.0044 h 1.686381 v -3.001879 c 2e-5,-0.241173 -0.17994,-0.437825 -0.40315,-0.437836 z m 10.538461,0.404154 h 0.68703 v 1.683981 h 0.48404 8.3e-4 2.63319 v 0.899101 h -2.63319 -1.19381 v -0.8991 h 0.0214 z m -10.308502,0.03074 h 0.685632 v 1.685442 h 0.0227 v 0.897637 H 98.930876 96.353042 V 77.26665 h 2.577834 0.540829 z m 7.811582,0.111281 c -0.21463,1.71e-4 -0.42499,0.05736 -0.61182,0.165454 h 1.21935 c -0.18519,-0.1072 -0.3947,-0.16435 -0.60753,-0.165454 z m 0.60753,0.165454 c 0.39345,0.22454 0.63743,0.648978 0.63878,1.109964 6e-5,0.704394 -0.55795,1.275473 -1.24631,1.275433 -0.68837,4e-5 -1.24642,-0.571039 -1.24634,-1.275433 3e-4,-0.459855 0.24311,-0.884017 0.63452,-1.109964 h -1.33719 v 2.698765 h 3.91786 v -2.698769 z m -5.29193,-0.134708 c -0.21283,0.0011 -0.42087,0.05825 -0.60614,0.165456 h 1.21937 c -0.18687,-0.108171 -0.39849,-0.165348 -0.61323,-0.165461 z m 0.61323,0.165456 c 0.39125,0.226039 0.63289,0.650183 0.63311,1.109962 8e-5,0.704387 -0.55796,1.275467 -1.24634,1.275431 -0.68834,3.6e-5 -1.2464,-0.571044 -1.24634,-1.275431 0.002,-0.460991 0.24679,-0.885408 0.6402,-1.109962 h -1.36131 v 2.698762 h 3.91643 v -2.698762 z m -7.906679,3.086807 v 0.773168 h 5.320329 v 1.395507 h -4.695741 v 1.095319 h 0.0015 0.555025 v -0.33387 h 16.890756 v 0.333866 h 0.50251 l -0.50251,0.02927 v 0.616483 h -0.6615 v 11.115743 h -1.34002 -8.2e-4 l -0.0468,0.0074 0.037,-9.072995 v -1.821658 h 0.006 v -0.878644 h -0.92269 v 0.01899 h -0.0134 l 0.0134,0.0015 v 0.629662 h -0.008 v -0.622361 l -8.2e-4,0.622341 v 11.164058 h -8.3e-4 V 83.623258 h -8.2e-4 l -0.0412,10.426034 h -0.79504 v 0.723383 h 1.06325 v -0.0089 h 3.30035 v -13.61963 h -4.52996 v -1.395503 h 5.34163 v -0.77317 z m 15.129139,4.647786 0.004,-0.738021 H 99.419041 l -0.0017,-0.650162 v 0.650162 h -0.01846 v -0.658952 -0.0027 h -0.92412 v 0.661882 0.263585 l 0.01423,10.877049 H 97.108355 V 82.885308 h -0.620326 v -0.644305 l -0.556446,-0.0015 v 12.52442 h 2.252759 1.057541 v 0.01014 h 1.063207 v -0.723356 h -0.838922 l -0.04257,-10.442142 h 3.472102 v 1.388185 h -1.45215 v 2.439572 h 0.96668 v -1.044068 h 4.95836 v 1.044068 h 0.98798 V 84.99677 h -1.45784 V 83.632 l 3.46218,0.01158 v -0.02026 h -3.46218 v -0.01473 h 3.46218 v 0.01473 z m -3.06613,3.85412 v -0.041 m -4.95836,0 v 0.041 m 8.96421,6.523587 V 82.885275 h 8.3e-4 l -8.3e-4,-0.620876 -8.3e-4,0.620876 h -8.2e-4 v 0.228449 l -0.006,1.82163 v 9.065671 z m -3.85822,-14.24939 h 0.9979 v 1.376472 h -0.9979 z m -5.97189,0.01335 h 0.99792 v 1.377935 h -0.99935 z m 1.9362,0.05566 h 3.12862 v 1.294472 h -3.12862 z m 0.22855,3.788227 h 2.37344 v 0.01158 h -0.15615 v 0.0027 h -1.62534 l 1.62534,0.006 v -0.0044 h 0.15615 v 1.372077 h -2.37344 z";
                var dVehicle = "m 109.66806,75.115574 c -0.22328,1.2e-5 -0.40318,0.196657 -0.40316,0.437838 v 3.001878 h 1.68781 v 0.0044 h 2.8731 c 0.17233,6.1e-5 0.31097,-0.150693 0.31086,-0.336797 v -1.049895 c 4e-5,-0.241172 -0.18118,-0.436357 -0.40453,-0.436369 h -2.77943 l -8.2e-4,0.07762 v -1.36183 c 7e-5,-0.185914 -0.13875,-0.336632 -0.31087,-0.336794 z m -10.426311,0.03074 c -0.172288,-6.4e-5 -0.310968,0.150722 -0.31087,0.336795 v 1.284222 h -2.780827 c -0.223132,2.37e-4 -0.404591,0.196797 -0.40456,0.437833 v 1.048459 c -9.8e-5,0.185945 0.14015,0.336636 0.312293,0.336798 h 2.873094 v -0.0044 h 1.686381 v -3.001879 c 2e-5,-0.241173 -0.17994,-0.437825 -0.40315,-0.437836 z m 10.538461,0.404154 h 0.68703 v 1.683981 h 0.48404 8.3e-4 2.63319 v 0.899101 h -2.63319 -1.19381 v -0.8991 h 0.0214 z m -10.308502,0.03074 h 0.685632 v 1.685442 h 0.0227 v 0.897637 H 98.930876 96.353042 V 77.26665 h 2.577834 0.540829 z m 7.811582,0.111281 c -0.21463,1.71e-4 -0.42499,0.05736 -0.61182,0.165454 h 1.21935 c -0.18519,-0.1072 -0.3947,-0.16435 -0.60753,-0.165454 z m 0.60753,0.165454 c 0.39345,0.22454 0.63743,0.648978 0.63878,1.109964 6e-5,0.704394 -0.55795,1.275473 -1.24631,1.275433 -0.68837,4e-5 -1.24642,-0.571039 -1.24634,-1.275433 3e-4,-0.459855 0.24311,-0.884017 0.63452,-1.109964 h -1.33719 v 2.698765 h 3.91786 v -2.698769 z m -5.29193,-0.134708 c -0.21283,0.0011 -0.42087,0.05825 -0.60614,0.165456 h 1.21937 c -0.18687,-0.108171 -0.39849,-0.165348 -0.61323,-0.165461 z m 0.61323,0.165456 c 0.39125,0.226039 0.63289,0.650183 0.63311,1.109962 8e-5,0.704387 -0.55796,1.275467 -1.24634,1.275431 -0.68834,3.6e-5 -1.2464,-0.571044 -1.24634,-1.275431 0.002,-0.460991 0.24679,-0.885408 0.6402,-1.109962 h -1.36131 v 2.698762 h 3.91643 v -2.698762 z m -7.906679,3.086807 v 0.773168 h 5.320329 v 1.395507 h -4.695741 v 1.095319 h 0.0015 0.555025 v -0.33387 h 16.890756 v 0.333866 h 0.50251 l -0.50251,0.02927 v 0.616483 h -0.6615 v 11.115743 h -1.34002 -8.2e-4 l -0.0468,0.0074 0.037,-9.072995 v -1.821658 h 0.006 v -0.878644 h -0.92269 v 0.01899 h -0.0134 l 0.0134,0.0015 v 0.629662 h -0.008 v -0.622361 l -8.2e-4,0.622341 v 11.164058 h -8.3e-4 V 83.623258 h -8.2e-4 l -0.0412,10.426034 h -0.79504 v 0.723383 h 1.06325 v -0.0089 h 3.30035 v -13.61963 h -4.52996 v -1.395503 h 5.34163 v -0.77317 z m 15.129139,4.647786 0.004,-0.738021 H 99.419041 l -0.0017,-0.650162 v 0.650162 h -0.01846 v -0.658952 -0.0027 h -0.92412 v 0.661882 0.263585 l 0.01423,10.877049 H 97.108355 V 82.885308 h -0.620326 v -0.644305 l -0.556446,-0.0015 v 12.52442 h 2.252759 1.057541 v 0.01014 h 1.063207 v -0.723356 h -0.838922 l -0.04257,-10.442142 h 3.472102 l 0,0.725156 -1.45215,0.663029 v 0.706655 h 0.96668 l 0,-0.637209 4.95836,-0.04521 v 0.63721 h 0.98798 l 0,-0.661429 -1.45784,-0.708236 0,-0.656534 3.46218,0.01158 v -0.02026 h -3.46218 v -0.01473 h 3.46218 v 0.01473 z m -3.06613,1.895171 v -0.05607 m -4.95836,-0.105482 v 0.116344 m 8.96421,8.527743 V 82.885275 h 8.3e-4 l -8.3e-4,-0.620876 -8.3e-4,0.620876 h -8.2e-4 v 0.228449 l -0.006,1.82163 v 9.065671 z m -3.85822,-14.24939 h 0.9979 v 1.376472 h -0.9979 z m -5.97189,0.01335 h 0.99792 v 1.377935 h -0.99935 z m 1.9362,0.05566 h 3.12862 v 1.294472 h -3.12862 z m 0.22855,3.788227 h 2.37344 v 0.01158 h -0.15615 v 0.0027 h -1.62534 l 1.62534,0.006 v -0.0044 h 0.15615 l 0,0.663841 -2.37344,0.01507 z";
                var dCar = "m 114.24837,75.101596 h 0.52518 v 0.54212 m -19.444994,0.02463 v -0.525182 h 0.542124 m 13.60476,12.530339 h 0.4536 v 3.486507 h -0.4536 z m -9.52943,0.07046 h 0.45363 v 3.486507 h -0.45363 z m 10.34758,-2.192007 V 85.84875 H 99.373187 v -0.296808 h -1.536283 v 7.808368 h 14.116226 v -7.808364 z m -1.39466,0.985351 h 1.8275 v 1.186037 h -0.005 v 4.747785 H 99.177279 v -4.725889 h -0.0309 v -1.186034 h 0.0309 v -0.0074 h 9.723161 z m 0,0.01462 v 0.767574 h 0.52391 v 0.403864 h 1.29744 v -1.171438 z m 0.52391,1.171438 h -0.52391 v -0.403947 h -7.92639 v 0.425759 h -0.57941 v 3.527693 h 0.63025 v 0.372228 h 7.84631 V 91.2461 h 0.55315 v -0.193401 h -8.99123 v -0.722565 h 8.99123 v -0.506045 h -8.99887 v -0.721352 h 8.99887 v -0.489013 h -8.99583 V 87.89116 h 8.99583 z m 0,0.167869 v 0.722561 h 0.005 v -0.72266 z m 0,1.211578 v 0.721353 h 0.001 v -0.721353 z m 0,1.2274 v 0.722565 h 0.0104 v -0.722565 z m 0,0.915975 v 0.398998 h -0.55315 v 0.787035 h 1.82752 v -1.186023 z m -8.39946,0.398998 h -0.63025 v -0.372243 h -1.19728 v 1.184817 h 1.82753 z m -0.63025,-3.899921 V 87.3195 h 0.57941 v -0.760275 h -1.796748 v 1.186034 z";
                var center = { x: 2, y: 0 };
                getCenterPoint(dVehicle, center);
                var tsf0 = 'translate(' + (centerPoint.x-center.x) + ',' + (centerPoint.y-center.y)+')';
				createSvg('path', {
					'id': graphID,
					'name': graphID,
					'd': dVehicle,
					'fill': vehicle.fillColor,
					'stroke': '#060006',
					'stroke-width':0.01,
					'stroke-linejoin':'round',
					'stroke-dasharray':'none',
					'stroke-opacity':0.982571,
					'transform': tsf0
				}).appendTo($('#' + g_currentZoneId + ' svg g'));
				//show vehicle name
				bbox = document.getElementById(graphID).getBBox();
				width = bbox.width;
				height = bbox.height;
				var cx = centerPoint.x;
				var cy = centerPoint.y;
				var fontSize0 = parseInt((width > height ? height : width) / 12 + 3);
				if (width > height * 1.5) {
					fontSize0 = fontSize0 + 3;
				} else if (width > height * 1.2) {
					fontSize0 = fontSize0 + 2;
				}
				if (fontSize0 < 7) {
					fontSize0 = 4
				}
				if (fontSize0 > 12) {
					fontSize0 = 12;
				}
				createSvg('text', {
					'x': cx,
					'y': cy - height/2 + yy,
					'id': nameID,
					'name': nameID,
					'fill': vehicle.fillColor,
					'font-family': g_fontFamily,
					'font-size': fontSize0 + 2,
					'stroke': '#000000',
					'stroke-dasharray': 'null',
					'stroke-linecap': 'null',
					'stroke-linejoin': 'null',
					'stroke-width': '0',
					'text-anchor': 'middle',
					'xml:space': 'preserve',
				}).appendTo($('#' + g_currentZoneId + ' svg g'));
				$('#' + g_currentZoneId + ' #' + nameID).html(vehicle.vehicleName);
				//Show Car ID
				if ( vehicle.emptyFlag === '1') {
				    createSvg('path', {
                		'id': graphCar,
                		'name': graphCar,
                		'd': dCar,
                		'fill': '#fc091d',
                		'stroke': '#f70019',
                		'stroke-width':0.119562,
                		'stroke-linejoin':'round',
                		'stroke-dasharray':'none',
                		'stroke-opacity':0.983379,
                		'transform': tsf0
                	}).appendTo($('#' + g_currentZoneId + ' svg g'));
					createSvg('text', {
						'x': cx,
						'y': cy + height/1.3,
						'id': carIDName,
						'name': carIDName,
						'fill': '#000000',
						'font-family': g_fontFamily,
						'font-size': fontSize0,
						'stroke': '#000',
						'stroke-dasharray': 'null',
						'stroke-linecap': 'null',
						'stroke-linejoin': 'null',
						'stroke-width': '0',
						'text-anchor': 'middle',
						'xml:space': 'preserve',
					}).appendTo($('#' + g_currentZoneId + ' svg g'));
					$('#' + g_currentZoneId + ' #' + carIDName).html(vehicle.carID);
					$("#FabViewZone svg #" + graphCar).on("click", function(arg0) {
                         startShowVehicleInfo(vehicle);
                    });
				}
				//click 
				$("#FabViewZone svg #" + graphID).on("click", function(arg0) {
					startShowVehicleInfo(vehicle);
				});
				return false;
			}
		});
	});
}
function updateStationState(stationList){
    var regex = /^PORT_/;
    var pathIdMap = [];
    //Clear station
	$.each($("#" + g_currentZoneId + " rect"), function(index, path) {
		if (regex.test($(this).attr("id"))) {
			var graphID = $(this).attr("id");
			var carIDName = $(this).attr("id") + '_carID';
			pathIdMap.push(
				{
					'id': $(this).attr("id"),
					'x': Number.parseFloat($(this).attr("x")),
					'y': Number.parseFloat($(this).attr("y")),
					'transform':$(this).attr("transform"),
					'width': Number.parseFloat($(this).attr("width")),
					'height': Number.parseFloat($(this).attr("height"))
				});
			var shape = document.getElementById(graphID);
			if (shape != null) {
				d3.select('#' + g_currentZoneId + ' #' + graphID).style("fill", "none");
			}
			shape = document.getElementById(carIDName);
			if (shape != null) {
				shape.remove();
			}
		}
	});
    //Set station color and carID
	$.each(stationList, function(index, station) {
		$.each(pathIdMap, function(index, path) {
			if (path.id == "PORT_" + station.stationID) {
				var graphID = path.id;
				var carIDName = path.id + '_carID';
				var currentPoint = { x: path.x, y: path.y - 0.5 };
                getTransformPoint(path.transform,currentPoint);
				//show color
				var shape = document.getElementById(graphID);
				if (shape != null) {
					d3.select('#' + g_currentZoneId + ' #' + graphID).style("fill", "none");
				}
				shape = document.getElementById(carIDName);
				if (shape != null) {
					shape.remove();
				}
				//Show Car ID
				if (station.carID != "") {
					d3.select('#' + g_currentZoneId + ' #' + graphID).style("fill", station.color);
					createSvg('text', {
						'x': currentPoint.x + path.width / 2,
						'y': currentPoint.y,
						'id': carIDName,
						'name': carIDName,
						'fill': station.color,
						'font-family': g_fontFamily,
						'font-size': 1,
						'stroke': '#000000',
						'stroke-dasharray': 'null',
						'stroke-linecap': 'null',
						'stroke-linejoin': 'null',
						'stroke-width': '0',
						'text-anchor': 'middle',
						'xml:space': 'preserve',
					}).appendTo($('#' + g_currentZoneId + ' svg g'));
					$('#' + g_currentZoneId + ' #' + carIDName).html(station.carID);
				}
				return false;
			}
		});
	});
}
function getTransformPoint(transform, currentPoint) {
	if (transform != null) {
		var tsfMode = transform.split("(")[0];
		var ts = transform.split("(")[1];
		var pt = ts.split(")")[0].split(",");
		if (tsfMode === 'scale') { // 缩放
			currentPoint.x *= Number.parseFloat(pt[0]);
			if (pt.length > 1) {
				currentPoint.y *= Number.parseFloat(pt[1]);
			}
		}
		else if (tsfMode === 'translate') { // 平移
			currentPoint.x += Number.parseFloat(pt[0]);
			if (pt.length > 1) {
				currentPoint.y += Number.parseFloat(pt[1]);
			}
		}
        else if (tsfMode === 'rotate') { // 旋转 rotate(180,1644.75,3214.75)
		}
        else if (tsfMode === 'matrix') {// 矩阵变换
		}
        else if (tsfMode === 'skewX') {// 扭曲
		}
        else if (tsfMode === 'skewY') {// 扭曲
		}
	}
}
function transformPoint(rect,centerPoint){
    if(rect == null ) return;
    var transformMatrix = rect.viewportElement.createSVGMatrix(); // 获取元素的当前变换矩阵
    var localTransformList = rect.transform.baseVal
    if (localTransformList.length) {
        transformMatrix = localTransformList.consolidate().matrix
        var point = $('svg')[0].createSVGPoint(); // 创建SVG点对象
//        var point = document.getElementById('svg1').createSVGPoint(); // 创建SVG点对象
        point.x = rect.getAttribute("x"); // 获取矩形元素的原始x坐标值
        point.y = rect.getAttribute("y"); // 获取矩形元素的原始y坐标值
        var transformedPoint = point.matrixTransform(transformMatrix); // 将原始点坐标转换为变换后的坐标
        centerPoint.x = transformedPoint.x; // 变换后的x坐标值
        centerPoint.y = transformedPoint.y; // 变换后的y坐标值
    }
}
function getCenterPoint(d, centerPoint) {
	// 解析SVG路径，转换为一系列命令和参数
	var commands = d.split(" ");
	var points = [];
	var currentPoint = { x: 0, y: 0 }; // 起始点坐标

	for (var i = 0; i < commands.length; i++) {
		var command = commands[i];
		var params;
		if (command == "M" || command == "m") {
			params = commands[i + 1].split(",");
			i++; // 跳过下一个参数
		}
		else {
			continue;
		}
		// 解析命令，计算点的坐标
		currentPoint.x += +params[0];
		currentPoint.y += +params[1];
		// 将计算出的点添加到点集中
		points.push({ x: currentPoint.x, y: currentPoint.y });
	}

	// 计算图形的边界框
	var minX = Math.min.apply(null, points.map(function(p) { return p.x; }));
	var minY = Math.min.apply(null, points.map(function(p) { return p.y; }));
	var maxX = Math.max.apply(null, points.map(function(p) { return p.x; }));
	var maxY = Math.max.apply(null, points.map(function(p) { return p.y; }));

	// 计算对称中心点坐标
	centerPoint.x += (maxX + minX) / 2;
	centerPoint.y += (maxY + minY) / 2;
}

function startEqpStatusChangeHis(pathId,  eqpId)
{
    var w = document.documentElement.clientWidth;
    w = w /2;
    if( w < 1200){
        w = 1200;
    }
    
    if(w > 2500){
        w = 2500;
    }
    
    $("#modal-eqpHisDialog").css("width", w + "px");
    $("#modal-eqpHisDialog-title").html('Status Change History for ' + eqpId);
    $("#eqpHisDialog-grouplist").children("tbody").empty();

    $("#modal-eqpHisGroup").modal("show");

	$.ajax({
		url : "api/listEqpStatusChangeHis",
		type : 'POST',
		beforeSend: function(request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
		data:{eqpId: eqpId, lotType: g_lotType},
		success : function(data) {
			try{
				$("#eqpHisDialog-grouplist").children("tbody").empty();
				$('#eqpHisDialog-grouplist').DataTable().clear();
				$('#eqpHisDialog-grouplist').DataTable().destroy();
			}catch(error){
				
			}

                
                $.each(data,function(index, item) 
                {
                    $('#eqpHisDialog-grouplist').children("tbody").append("<tr><td><input type='checkbox' class='minimal' /></td><td>"
                                            + item.eventCreateTime
                                            + "</td><td>"
                                            + item.eqpId
                                            + "</td><td>"
                                            + item.e10State + '.' + item.eqpState 
                                            + "</td><td>"
                                            + item.newE10State + '.' + item.newEqpmentState 
                                            + "</td><td>"
                                            + item.claimUserId
                                            + "</td><td>"
                                            + item.claimMemo
                                            + "</td><td>"
                                            + item.startTime
                                            + "</td><td>"
                                            + item.endTime
                                            + "</td></tr>" );
                });

				$('#eqpHisDialog-grouplist tbody tr ').on('click',function(){
					$('#eqpHisDialog-grouplist tbody tr ').removeClass("active");
					$('#eqpHisDialog-grouplist tbody tr ').removeClass("info");
					$(this).addClass("info");
                });
                
                $('#eqpHisDialog-grouplist tr').find('td:eq(0)').hide();
                $('#eqpHisDialog-grouplist tr').find('th:eq(0)').hide();

				$('#eqpHisDialog-grouplist').on('page.dt',function (){
				// 	$("#selectAll").prop("checked",false);
				// 	$("#selectAll").parent().removeClass("checked").attr("aria-checked",false);
				// 	$("#grouplist tbody input[type='checkbox']").each(function(){
				// 		$(this).prop("checked",false);
				// 		$(this).parent().removeClass("checked").attr("aria-checked",false);
				// 	});
                }).DataTable();
                
                
                // $("#grouplist").dataTable(
                //     {
                //         autoWidth: false,//自动适应宽度
                //         searching: false,//搜索框
                //         destroy: true,//是否销毁
                //         ordering: false,//是否排序
                //         oLanguage:{
                //             sInfo:       "Showing _START_ to _END_ of _TOTAL_ rows",
                //             sLengthMenu: "Show _MENU_ rows",
                //         }
                //     }
                // );

			
			$('#eqpHisDialog-databox').show();
			
			//Select All
			$("#selectAll").siblings(":first").click(function(){
				// $("#grouplist tbody input[type='checkbox']").each(function(){
				// 	$(this).prop("checked",false);
				// 	$(this).parent().removeClass("checked").attr("aria-checked",false);
				// 	$(this).prop("checked",$("#selectAll").prop("checked"));
				// 	if($("#selectAll").prop("checked") == true){
				// 		$(this).parent().addClass("checked").attr("aria-checked",true);
				// 	}
				// });
            });

            $("#eqpHisDialog-databox").css("width", "100%");
            $("#eqpHisDialog-grouplist").css("width", "100%");

            //var refreshBtnText = sessionStorage.getItem("wfm.refresh");
            // showLotTypeSelect("grouplist", refreshBtnText);

            // $('#grouplist thead tr ').hide()
		}});
}
function startShowVehicleInfo(vehicle)
{
	var w = document.documentElement.clientWidth;
	w = w / 3;
	if (w < 800) {
		w = 800;
	}
	if (w > 2000) {
		w = 2000;
	}
	$("#modal-dialog").css("width", w + "px");
	$("#modal-dialog-title").html(vehicle.vehicleName);
	$("#grouplist").children("tbody").empty();
	$("#modal-addGroup").modal("show");
	$('#grouplist').children("tbody").append("<tr><td><input type='checkbox' class='minimal' /></td><td>"
		+ vehicle.vehicleName
		+ "</td><td>"
		+ vehicle.state
		+ "</td><td>"
		+ vehicle.emptyFlag
		+ "</td><td>"
		+ vehicle.currentLocation
		+ "</td><td>"
		+ vehicle.currentDistance
		+ "</td><td>"
		+ vehicle.nextLocation
		+ "</td><td>"
		+ vehicle.carID
		+ "</td><td>"
		+ vehicle.dest
		+ "</td></tr>");
	    $('#grouplist tbody tr ').on('click', function() {
		$('#grouplist tbody tr ').removeClass("active");
		$('#grouplist tbody tr ').removeClass("info");
		$(this).addClass("info");
	});

	$('#grouplist tr').find('td:eq(0)').hide();
	$('#grouplist tr').find('th:eq(0)').hide();
	$('#databox').show();
	$("#databox").css("width", "100%");
	$("#grouplist").css("width", "100%");
}
