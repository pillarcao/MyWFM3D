package com.ibm.waferview.wfm.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import com.ibm.waferview.wfm.utils.StringUtils;
import com.ibm.waferview.wfm.vo.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ibm.waferview.wfm.constant.Constants;
import com.ibm.waferview.wfm.dao.WfmMonitorMapper;
import com.ibm.waferview.wfm.exception.CommonException;
import com.ibm.waferview.wfm.service.ColorDefineService;
import com.ibm.waferview.wfm.service.MonitorService;
import com.ibm.waferview.wfm.utils.FileUtil;
import com.ibm.waferview.wfm.utils.JsonUtil;

import lombok.extern.slf4j.Slf4j;

@Service("monitorService")
@Slf4j
public class MonitorServiceImpl implements MonitorService
{
    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    @Resource
    WfmMonitorMapper monitorMapper;
    @Resource
    ColorDefineService colorDefineService;
    @Value("${mcp.mcpName}")
    String mcpName;

//    @Resource
//    private RedisUtil redisUtil;


    /*  
     * @Author zhuxiuhong
     * @Since 2020年9月25日 上午10:39:32
     * @see com.ibm.waferview.wfm.service.MonitorService#geteqpStatusInfo(java.lang.String)
     */
    @Override
    public EqpStatusInfo getEqpStatusInfo(String userId, String eqpId, String lotType)
    {
        EqpStatusInfo eqpStatusInfo = new EqpStatusInfo();
        log.info("getEqpStatus: eqpId = {}", eqpId);
        String[] eqpIds = new String[1];
        eqpIds[0] = eqpId;

        List<EqpStatus> eqpStatusList = monitorMapper.listEqpStatus(eqpIds);

        if (eqpStatusList == null || eqpStatusList.isEmpty()) {
            // 没有找到这个机台.
            log.info("eqpStatusList = {} <===== return null  ", eqpStatusList);
            return null;
        }

        eqpStatusInfo.setEqpStatus(eqpStatusList.get(0));
        log.info("getEqpPortStatus: eqpId = {}", eqpId);
        List<EqpPortStatus> eqpPortStatusList = monitorMapper.listEqpPortStatus(eqpIds);
        eqpStatusInfo.setEqpPortStatusList(eqpPortStatusList);

        log.info("getInprocessLot: eqpId = {}", eqpId);
        eqpStatusInfo.setInprocessLotCnt(monitorMapper.getInprocessLot(eqpId));

        log.info("getEqpChamberStatus: eqpId = {}", eqpId);
        List<EqpChamberStatus> eqpChamberStatusList = monitorMapper.listEqpChamberStatus(eqpIds);
        eqpStatusInfo.setEqpChamberStatusList(eqpChamberStatusList);

//        eqpStatusInfo.setWipCnt(monitorMapper.getWipCount(eqpId, lotType));

        setStatusColors(eqpStatusInfo, getColorMap());

        log.info("eqpStatusInfo:[{}]", eqpStatusInfo);

        return eqpStatusInfo;
    }

    @Override
    public List<ColorDefine> listColors()
    {
        List<ColorDefine> colors = colorDefineService.listColorDefs();
        if (colors == null || colors.isEmpty()) {
            throw new CommonException("wfm.colordef.not.exist");
        }
        return colors;
    }

    @Override
    public Map<String, List<ColorDefine>> getColorMap()
    {
        List<ColorDefine> colors = listColors();

        Map<String, List<ColorDefine>> colorMap = 
                colors.stream().collect(Collectors.groupingBy((ColorDefine::getCategory), //
                        Collectors.mapping(s -> s, Collectors.toList())));
        
        String data = JsonUtil.toJson(colorMap);
        FileUtil.writeString(Constants.KEY_FILE_COLOR_JSON, data);
        
//        String key = "wfm_colorMaps";
//        if (env != null) {
//            key += "_" + env;
//        }
//        redisUtil.set(key, data, 30 * 60);
        return colorMap;
    }

    private void setStatusColors(EqpStatusInfo eqpStatusInfo, //
            Map<String, List<ColorDefine>> colorMap)
    {
//        List<ColorDefine> COLOR_EQP_CATEGORYs = colorMap.get(Constants.COLOR_EQP_CATEGORY);
        List<ColorDefine> COLOR_EQP_STATEs = colorMap.get(Constants.COLOR_EQP_STATE_BG);
        List<ColorDefine> COLOR_EQP_STATEs_font = colorMap.get(Constants.COLOR_EQP_STATE_FG);
        // List<ColorDefine> COLOR_CHAMBER_STATEs = colorMap.get(Constants.COLOR_CHAMBER_STATE_BG);
        List<ColorDefine> COLOR_EQP_PORT_STATEs = colorMap.get(Constants.COLOR_EQP_PORT_STATE_BG);
        List<ColorDefine> COLOR_EQP_MODEs = colorMap.get(Constants.COLOR_EQP_MODE);

//        if (eqpStatusInfo.getEqpStatus().getEqpCategory() != null
//                && COLOR_EQP_CATEGORYs != null ) {
//            for (ColorDefine c : COLOR_EQP_CATEGORYs) {
//                if (eqpStatusInfo.getEqpStatus().getEqpCategory().equals(c.getItem())) {
//                    eqpStatusInfo.getEqpStatus().setEqpCategoryColor(c.getColor());
//                    break;
//                }
//            }
//        }
        if (eqpStatusInfo.getEqpStatus().getEqpModeColor() != null && COLOR_EQP_MODEs != null ) {
            for (ColorDefine c : COLOR_EQP_MODEs) {
                if (StringUtils.isMatch(eqpStatusInfo.getEqpStatus().getEqpMode(),c.getItem())) {
                    eqpStatusInfo.getEqpStatus().setEqpModeColor(c.getColor());
                    break;
                }
            }
        }

        /*
         ****** 机台的当前状态. *******
         */
        if (eqpStatusInfo.getEqpStatus().getE10State() != null
                && eqpStatusInfo.getEqpStatus().getCurStateId() != null
                   && COLOR_EQP_STATEs != null ) {
            String eqpState = eqpStatusInfo.getEqpStatus().getE10State().trim();
//                    + "." + eqpStatusInfo.getEqpStatus().getCurStateId();
            for (ColorDefine c : COLOR_EQP_STATEs) {
                /*
                  机台的当前状态 背景色
                 */
                if (eqpState.equals(c.getItem())) {
                    eqpStatusInfo.getEqpStatus().setCurStateIdColor(c.getColor());
                    break;
                }
            }
            for (ColorDefine c : COLOR_EQP_STATEs_font) {
                /*
                  机台的当前状态 字体颜色
                 */
                if (eqpState.equals(c.getItem())) {
                    eqpStatusInfo.getEqpStatus().setFontColor(c.getColor());
                    break;
                }
            }
        }

        if (eqpStatusInfo.getEqpChamberStatusList() != null && COLOR_EQP_STATEs != null
                && !eqpStatusInfo.getEqpChamberStatusList().isEmpty()) {
            for (EqpChamberStatus ch : eqpStatusInfo.getEqpChamberStatusList()) {
                // Chamber 状态.
//                String chState = ch.getE10State() + "." + ch.getEqpStateId();
                String chState = ch.getE10State().trim();
                for (ColorDefine c : COLOR_EQP_STATEs) {
                    if (chState.equals(c.getItem())) {
                        ch.setEqpStateIdColor(c.getColor());
                        break;
                    }
                }
            }
        }

        if (eqpStatusInfo.getEqpPortStatusList() != null //
                && !eqpStatusInfo.getEqpPortStatusList().isEmpty()
                    && COLOR_EQP_PORT_STATEs != null ) {
            for (EqpPortStatus port : eqpStatusInfo.getEqpPortStatusList()) {
                for (ColorDefine c : COLOR_EQP_PORT_STATEs) {
                    if (port.getPortState() != null //
                            && port.getPortState().equals(c.getItem())) {
                        port.setPortStateColor(c.getColor());
                        break;
                    }
                }
            }
        }
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年10月27日 下午11:54:18
     * @see com.ibm.waferview.wfm.service.MonitorService#getEqpInfo(java.lang.String[])
     */
    @Override
    public List<EqpInfo> listEqpInfo(String[] eqpIds)
    {
        List<EqpPortStatus> eqpPortStatusList = monitorMapper.listEqpPortStatus(eqpIds);
        List<EqpChamberStatus> eqpChamberStatusList = monitorMapper.listEqpChamberStatus(eqpIds);

        Map<String, List<EqpPortStatus>> eqpPortStatusMap = //
                eqpPortStatusList.stream().collect(Collectors.groupingBy((EqpPortStatus::getEqpId), //
                        Collectors.mapping(s -> s, Collectors.toList())));

        Map<String, List<EqpChamberStatus>> eqpChamberStatusMap = //
                eqpChamberStatusList.stream().collect(Collectors.groupingBy((EqpChamberStatus::getEqpId), //
                        Collectors.mapping(s -> s, Collectors.toList())));

        List<EqpInfo> eqpInfos = new LinkedList<>();

        for (String eqpId : eqpIds) {
            EqpInfo eqpInfo = new EqpInfo();
            eqpInfo.setEqpId(eqpId);
            if (eqpPortStatusMap.containsKey(eqpId)) {
                List<String> portIds = (eqpPortStatusMap.get(eqpId)).stream()//
                        .map(EqpPortStatus::getPortId).collect(Collectors.toList());
                eqpInfo.setPortList(portIds);
            }

            if (eqpChamberStatusMap.containsKey(eqpId)) {
                List<String> chambers = (eqpChamberStatusMap.get(eqpId)).stream()//
                        .map(EqpChamberStatus::getProcessId).collect(Collectors.toList());
                eqpInfo.setChamberList(chambers);
            }

            eqpInfos.add(eqpInfo);
        }

        return eqpInfos;
    }
    @Override
    public List<EqpStatusInfo> listEqpStatusInfo(String[] eqpIds)
    {
        // log.info("1.1: listEqpStatus");
        ///// 1: eqpStatus
        List<EqpStatus> eqpStatusList = monitorMapper.listEqpStatus(eqpIds);
        calculateStateChgTime(eqpStatusList, new Date().getTime());

        // log.info("1.2: eqpStatusMap");
        Map<String, EqpStatus> eqpStatusMap = //
                eqpStatusList.stream().collect( //
                        Collectors.toMap(EqpStatus::getEqpId, e -> e));

        // log.info("2.1: listEqpPortStatus");
        ///// 2: eqpPortStatus
        List<EqpPortStatus> eqpPortStatusList = monitorMapper.listEqpPortStatus(eqpIds);

        // log.info("2.2: eqpPortStatusMap");
        Map<String, List<EqpPortStatus>> eqpPortStatusMap = //
                eqpPortStatusList.stream().collect(Collectors.groupingBy((EqpPortStatus::getEqpId), //
                        Collectors.mapping(s -> s, Collectors.toList())));

        // log.info("3.1: listEqpChamberStatus");
        ///// 3: eqpChamberStatus
        List<EqpChamberStatus> eqpChamberStatusList = monitorMapper.listEqpChamberStatus(eqpIds);

        // log.info("3.2: eqpChamberStatusMap");
        Map<String, List<EqpChamberStatus>> eqpChamberStatusMap = //
                eqpChamberStatusList.stream().collect(Collectors.groupingBy((EqpChamberStatus::getEqpId), //
                        Collectors.mapping(s -> s, Collectors.toList())));

        // log.info("4.1: listInprocessLot");
        ///// 4: inprocessLot
        List<EqpLotCount> inprocessLot = monitorMapper.listInprocessLot(eqpIds);

        // log.info("4.2: inprocessLotMap");
        Map<String, Integer> inprocessLotMap = //
                inprocessLot.stream().collect( //
                        Collectors.toMap(EqpLotCount::getEqpId, EqpLotCount::getLotCount));

        // log.info("4.3: inprocessLotIds");
        List<EqpInprocessLot> inprocessLotIds = monitorMapper.listInprocessLotIds(eqpIds);

        // log.info("4.4: inprocessLotIdsMap");
        Map<String, List<String>> inprocessLotIdsMap = new HashMap<>();
//                inprocessLotIds.stream().collect(Collectors.groupingBy((EqpInprocessLot::getEqpId), //
//                        Collectors.mapping(EqpInprocessLot::getInprocessLotId, Collectors.toList())));
        for(EqpInprocessLot ip:inprocessLotIds){
            String eqpID = ip.getEqpId();
            if(eqpID.contains("ET_EP") || eqpID.contains("EE_EP")){
                eqpID = eqpID.substring(0,8);
            }
            if(inprocessLotIdsMap.containsKey(eqpID)){
                inprocessLotIdsMap.get(eqpID).add(ip.getInprocessLotId());
            }
            else{
                List<String> lt = new ArrayList<>();
                lt.add(ip.getInprocessLotId());
                inprocessLotIdsMap.put(eqpID,lt);
            }
        }
        // log.info("5.1: listWipCount");
        ///// 5: wipCnt
        List<EqpLotCount> wipCnt = monitorMapper.listWipCount(eqpIds);

        // log.info("5.2: wipCntMap");
//        Map<String, Integer> wipCntMap = //
//                wipCnt.stream().collect( //
//                        Collectors.toMap(EqpLotCount::getEqpId, EqpLotCount::getLotCount));
        Map<String, List<EqpLotCount>> wipCntMap = new HashMap<>();
//                wipCnt.stream().collect(Collectors.groupingBy((EqpLotCount::getEqpId),
//                        Collectors.mapping(s -> s, Collectors.toList())));
        for(EqpLotCount wp:wipCnt){
            String eqpID = wp.getEqpId();
            if(eqpID.contains("ET_EP") || eqpID.contains("EE_EP")){
                eqpID = eqpID.substring(0,8);
		    }
            if(wipCntMap.containsKey(eqpID)){
                wipCntMap.get(eqpID).add(wp);
            }
            else{
                List<EqpLotCount> lt = new ArrayList<>();
                lt.add(wp);
                wipCntMap.put(eqpID,lt);
            }
        }

        // log.info("6.1: colorDefineMap");
        ///// 5: colorDefineMap
        Map<String, List<ColorDefine>> colorDefineMap = getColorMap();

        //////////////
        //////////////
        List<EqpStatusInfo> eqpStatusInfos = new LinkedList<>();
        // log.info("7.1: fill eqpStatusInfos");

        for (String eqpId : eqpStatusMap.keySet()) {
            EqpStatusInfo eqpStatusInfo = new EqpStatusInfo();
            eqpStatusInfo.setEqpStatus(eqpStatusMap.get(eqpId));
            eqpStatusInfo.setEqpPortStatusList(eqpPortStatusMap.get(eqpId));

            eqpStatusInfo.setEqpChamberStatusList(eqpChamberStatusMap.get(eqpId));
            eqpStatusInfo.setInprocessLotCnt(inprocessLotMap.get(eqpId));

            eqpStatusInfo.setInprocessLotIds(inprocessLotIdsMap.get(eqpId));

            eqpStatusInfo.setWipCntList(wipCntMap.get(eqpId));

            if (eqpStatusInfo.getEqpPortStatusList() == null) {
                eqpStatusInfo.setEqpPortStatusList(new LinkedList<>());
            }

            if (eqpStatusInfo.getEqpChamberStatusList() == null) {
                eqpStatusInfo.setEqpChamberStatusList(new LinkedList<>());
            }

            if (eqpStatusInfo.getInprocessLotCnt() == null) {
                eqpStatusInfo.setInprocessLotCnt(0);
            }
            if (eqpStatusInfo.getInprocessLotIds() == null) {
                eqpStatusInfo.setInprocessLotIds(new LinkedList<>());
            }

//            if (eqpStatusInfo.getWipCnt() == null) {
//                eqpStatusInfo.setWipCnt(0);
//            }

            setStatusColors(eqpStatusInfo, colorDefineMap);
            //////////
            eqpStatusInfos.add(eqpStatusInfo);
        }

        // log.info("end.");
        return eqpStatusInfos;

    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月13日 下午2:33:02
     * @see com.ibm.waferview.wfm.service.MonitorService#listWips(java.lang.String)
     */
    @Override
    public List<EqpWipInfo> listWips(String eqpId, String lotType)
    {
        return monitorMapper.listWips(eqpId, lotType);
    }


    private void calculateStateChgTime(List<EqpStatus> eqpStatusList, long nowTime)
    {
        for (EqpStatus s : eqpStatusList) {
            // PROD/SBY
            // if( s.getE10State().equals("PRD") || s.getE10State().equals("SBY")) {
            // continue;
            // }

            // 2020-03-24-18.53.28.190751
            String t = String.format("%s %s:%s:%s", //
                    s.getStateChgTime().substring(0, 10), //
                    s.getStateChgTime().substring(11, 13), //
                    s.getStateChgTime().substring(14, 16), //
                    s.getStateChgTime().substring(17, 19));
            String text;
            try {
                Date date = sdf.parse(t);
                long m0 = (nowTime - date.getTime()) / (60 * 1000); // 分钟数.

                double minute = (m0 % 60) / 60.0;
                if (minute > 0) {
                    minute = (double) Math.round(minute * 10) / 10;
                }

                long hour = m0 / 60; // 小时

                if (hour <= 48) {
                    text = String.format("%.1f", hour + minute);
                    text += hour + "H";
                } else {
                    long day = hour / 24;
                    if (day > 99) {
                        text = "+99D";
                    } else {
                        text = day + "D";
                        text += (hour % 24) + "H";
                    }
                }

                s.setStateChgTime4Text(text);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月26日 下午5:57:59
     * @see com.ibm.waferview.wfm.service.MonitorService#listEqpStateDef()
     */
    @Override
    public List<EqpStateDefine> listEqpStateDef()
    {
        return monitorMapper.listEqpStateDef();
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2021年10月29日 上午23:52:22
     * @see com.ibm.waferview.wfm.service.MonitorService#listEqpStatusChangeHis(java.lang.String)
     */
    @Override
    public List<EqpStatusChangeHis> listEqpStatusChangeHis(String eqpId)
    {
        return monitorMapper.listEqpStatusChangeHis(eqpId);
    }
	@Override
	public List<EqpInprocessLot> listInprLotByEqp(String eqpId) {
		return monitorMapper.listInprLotByEqp(eqpId);
	}

	@Override
	public List<AlrmHisInfo> listAlarmHis(String eqpId) {
		return monitorMapper.listAlarmHis(eqpId);
	}

    @Override
    public McpInfo getMcpInfo() {
        McpInfo mcp = monitorMapper.getMcpInfo(mcpName);
        if( mcp != null ){
            mcp.setVehicleList(listVehicleInfo());
            mcp.setStationList(monitorMapper.listMcpStation(mcpName));
        }
        return mcp;
    }
    @Override
    public List<VehicleInfo> listVehicleInfo() {
        return monitorMapper.listVehicleInfo(mcpName);
    }
}
