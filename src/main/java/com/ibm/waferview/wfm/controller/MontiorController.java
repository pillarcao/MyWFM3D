package com.ibm.waferview.wfm.controller;

import java.io.IOException;
import java.util.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.ibm.waferview.wfm.utils.StringUtils;
import com.ibm.waferview.wfm.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import com.ibm.waferview.wfm.constant.Constants;
import com.ibm.waferview.wfm.security.jwt.LoginUtils;
import com.ibm.waferview.wfm.service.EqpService;
import com.ibm.waferview.wfm.service.MonitorService;
import com.ibm.waferview.wfm.utils.FileUtil;
import com.ibm.waferview.wfm.utils.JsonUtil;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class MontiorController extends BaseController
{
    @Autowired
    MonitorService monitorService;

    @Autowired
    EqpService eqpService;

  //  @Resource
  //  private RedisUtil redisUtil;
    

    @RequestMapping(value = "/wfm_monitor", method = RequestMethod.GET)
    public ModelAndView loadUserView(String lang, HttpServletRequest request)
    {
        log.info("load welcome page...............");

        HttpSession session = request.getSession();
        if (lang == null || lang.trim().length() == 0) {
            lang = "zh_CN";
        }
        session.setAttribute("wfm-language", lang); // save lang to session
        
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/wfm/monitor");
        return mv;
    }
    @RequestMapping(value = "/wfmWfviewEqpt", method = RequestMethod.GET)
    public ModelAndView wfmWfviewEqpt(String eqptid)
    {

        ModelAndView mv = new ModelAndView();
        mv.setViewName("/web/wfm-wfview-eqpt");
        return mv;
    }

    @RequestMapping(value = "/wfm_monitor3d", method = RequestMethod.GET)
    public ModelAndView loadMonitor3dView(String lang, HttpServletRequest request)
    {
        log.info("load 3D monitor page...............");

        HttpSession session = request.getSession();
        if (lang == null || lang.trim().length() == 0) {
            lang = "zh_CN";
        }
        session.setAttribute("wfm-language", lang); // save lang to session

        ModelAndView mv = new ModelAndView();
        mv.setViewName("/wfm/monitor3d");
        return mv;
    }
    @RequestMapping(value = "/listEqpInfo", method = RequestMethod.POST)
    public List<EqpInfo> listEqpInfo(HttpServletRequest request)
    {
        EqpDef eqpDef = new EqpDef();
        List<String> allEqpList = eqpService.listEqpIds(eqpDef);

        String[] eqpIds = new String[allEqpList.size()];
        for (int i = 0; i < allEqpList.size(); ++i) {
            eqpIds[i] = allEqpList.get(i);
        }

        return monitorService.listEqpInfo(eqpIds);
    }

    @RequestMapping(value = "/getEqpStatusInfo", method = RequestMethod.POST)
    public EqpStatusInfo getEqpStatusInfo(String eqpId, String lotType, HttpServletRequest request)
    {
        log.info("getEqpInfo: eqpId = {}", eqpId);
        String userId = LoginUtils.getUsername(request);
        log.info("getEqpInfo: userId = [{}]", userId);

        return monitorService.getEqpStatusInfo(userId, eqpId, lotType);
    }

    @RequestMapping(value = "/getEqpStatusMaps")
    public Map<String, Object> getEqpStatusMaps(HttpServletRequest request, String lotType)
    {
//        log.info("getEqpStatusMaps: ");
        HttpSession session = request.getSession(false);
        if(session != null) {
            session.setAttribute("wfm-lotType", lotType);
        }
//        List<EqpStatusInfo> list = listEqpStatusInfo();
//        Map<String, List<ColorDefine>> colorMap =  getColorMap(request);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("eqpStatusList", listEqpStatusInfo());
        map.put("colorMap", getColorMap());
//        map.put("mcpInfo", getMcpInfo());
        return map;
    }
    @RequestMapping(value = "/getOHTStatus")
    public Map<String, Object> getOHTStatus()
    {
        Map<String, Object> map = new HashMap<>();
        map.put("mcpInfo", getMcpInfo());
        return map;
    }
    @RequestMapping(value = "/listEqpStatusInfo", method = RequestMethod.POST)
    public List<EqpStatusInfo> listEqpStatusInfo()
    {
        // log.info("listEqpStatusInfo: ");
        try {
        	StringBuffer data = FileUtil.readFile(Constants.KEY_FILE_STAT_JSON);
            return JsonUtil.getObjectMapper().readValue(data.toString(), new TypeReference<List<EqpStatusInfo>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
        List<String> allEqpList = eqpService.listEqpIds(new EqpDef());
        return monitorService.listEqpStatusInfo(allEqpList.toArray(new String[0]));
    }
    
    
    @RequestMapping(value = "/getColorMap", method = RequestMethod.POST)
    public Map<String, List<ColorDefine>> getColorMap()
    {
        try {
        	StringBuffer data = FileUtil.readFile(Constants.KEY_FILE_COLOR_JSON);
            return JsonUtil.getObjectMapper().readValue(data.toString(), new TypeReference< Map<String, List<ColorDefine>> >() {});
        } catch (IOException e) {
            e.printStackTrace();
        }
        return monitorService.getColorMap();
    }
    public McpInfo getMcpInfo(){
        try {
            StringBuffer data = FileUtil.readFile(Constants.KEY_FILE_MCP_JSON);
            return JsonUtil.getObjectMapper().readValue(data.toString(), new TypeReference<McpInfo>() {});
        } catch (IOException e) {
            e.printStackTrace();
        }
        return monitorService.getMcpInfo();
    }
    
    @RequestMapping(value = "/listWips", method = RequestMethod.POST)
    public List<EqpWipInfo> listWips(String eqpId, String lotType, HttpServletRequest request)
    {
        if(eqpId == null || eqpId.trim().length() == 0 ) {
            return new LinkedList<>();
        }
        
        HttpSession session = request.getSession(false);
        if(session != null) {
            session.setAttribute("wfm-lotType", lotType);
        }
        
        return monitorService.listWips(eqpId, lotType);
    }
    
    @RequestMapping(value = "/listEqpStatusChangeHis", method = RequestMethod.POST)
    public List<EqpStatusChangeHis> listEqpStatusChangeHis(String eqpId, HttpServletRequest request)
    {
        if(eqpId == null || eqpId.trim().length() == 0 ) {
            return new LinkedList<>();
        }
       
        return monitorService.listEqpStatusChangeHis(eqpId);
    }
    
    /**
     * 3D 设备模型注册表：eqpId(或类别) -> { source:gltf|extrude, url, transform, portNodeMap }。
     * 读 wfm_file/data/model.registry.json，缺省返回空表（前端则全部走拉伸）。
     */
    @RequestMapping(value = "/getEqpModelDefs")
    public Map<String, Object> getEqpModelDefs()
    {
        try {
            StringBuffer data = FileUtil.readFile(Constants.KEY_FILE_MODEL_JSON);
            if (data != null && data.length() > 0) {
                return JsonUtil.getObjectMapper().readValue(data.toString(), new TypeReference<Map<String, Object>>() {});
            }
        } catch (Exception e) {
            log.warn("getEqpModelDefs: registry not found or invalid, fallback to empty. {}", e.getMessage());
        }
        return new LinkedHashMap<>();
    }

    @RequestMapping(value = "/getSvgFile", method = RequestMethod.POST)
    public String getSvgFile(String floorNo , HttpServletRequest request)
    {
//        return FileUtil.readFile("../svg/FabView.jsp").toString();
        String filePath = "../svg/"+ StringUtils.toStringAndTrim(floorNo) +"/FabView.jsp";
        return FileUtil.readFile(filePath).toString();
    }
    
    @RequestMapping(value = "/getEqpInfor", method = RequestMethod.POST)
    public EqpDef getEqpInfor(String eqpId,HttpServletRequest request)
    {
        EqpDef eqpDef = new EqpDef();
        eqpDef.setEqpId(eqpId);
        return eqpService.listEqp(eqpDef).get(0);
    }
    
    @RequestMapping(value = "/listInprLotByEqp", method = RequestMethod.POST)
    public String listInprLotByEqp(String eqpId)
    {
        return JsonUtil.toJson(monitorService.listInprLotByEqp(eqpId));
    }
    
    @RequestMapping(value = "/listWipByEqp", method = RequestMethod.POST)
    public String listWipByEqp(String eqpId,HttpServletRequest request)
    {
        return JsonUtil.toJson(monitorService.listWips(eqpId, ""));
    }
    
    @RequestMapping(value = "/listAlarmHis", method = RequestMethod.POST)
    public String listAlarmHis(String eqpId,HttpServletRequest request)
    {
        return JsonUtil.toJson(monitorService.listAlarmHis(eqpId));
    }
}
