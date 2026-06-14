package com.ibm.waferview.wfm.service;

import java.util.List;

import java.util.Map;

import com.ibm.waferview.wfm.vo.*;
import org.springframework.stereotype.Service;

@Service
public interface MonitorService {
    EqpStatusInfo getEqpStatusInfo(String userId, String eqpId, String lotType);
    List<EqpInfo> listEqpInfo(String[] eqpIds);
    List<EqpStatusInfo> listEqpStatusInfo(String[] eqpIds);
    Map<String, List<ColorDefine>>getColorMap();
    List<ColorDefine> listColors();
    List<EqpWipInfo> listWips(String eqpId, String lotType);
    List<EqpStateDefine> listEqpStateDef();
    List<EqpStatusChangeHis> listEqpStatusChangeHis(String eqpId);
    List<EqpInprocessLot> listInprLotByEqp(String eqpId);
    List<AlrmHisInfo> listAlarmHis(String eqpId);
    McpInfo getMcpInfo();
    List<VehicleInfo> listVehicleInfo();
}
