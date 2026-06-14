package com.ibm.waferview.wfm.dao;

import java.util.List;

import com.ibm.waferview.wfm.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface WfmMonitorMapper
{

    /**
     * Equipment State (每个设备 只有一条记录)
     * 
     * @param
     * @return
     */
    List<EqpStatus> listEqpStatus(@Param("eqpIds") String[] eqpIds);
    
    /**
     * 从 MM.MESREQPST 中获取  EQPSTATE_ID 和  E10_STATE_ID
     * @return
     */
    List<EqpStateDefine> listEqpStateDef();

    /**
     * Chamber status (有多条记录)
     * 
     * @param
     * @return
     */
    List<EqpChamberStatus> listEqpChamberStatus(@Param("eqpIds") String[] eqpIds);


    List<EqpPortStatus> listEqpPortStatus(@Param("eqpIds") String[] eqpIds);
    
    /**
     * 获取在制程的 lot 个数. 
     * @param eqpId
     * @return
     */
    int getInprocessLot(@Param("eqpId") String eqpId);
    
    /**
     * WIP Count
     * @param eqpId
     * @return
     */
    int getWipCount(@Param("eqpId") String eqpId, @Param("lotType")String lotType);
    
    List<EqpWipInfo> listWips(@Param("eqpId") String eqpId, @Param("lotType")String lotType);
    
    /**
     * 获取在制程的 lot 个数. 
     * @param eqpIds
     * @return
     */
    List<EqpLotCount> listInprocessLot(@Param("eqpIds") String[] eqpIds);
    
    List<EqpInprocessLot> listInprocessLotIds(@Param("eqpIds") String[] eqpIds);
    
    /**
     * 
     * @param eqpIds
     * @return
     */
    List<EqpLotCount> listWipCount(@Param("eqpIds") String[] eqpIds);
   
    /**
     * 获取在机台切换的历史记录. 
     * @param
     * @return
     */
    List<EqpStatusChangeHis> listEqpStatusChangeHis(@Param("eqpId") String eqpId);
    /**
    * @Title: listInprLotByEqp
    * @Description: TODO(这里用一句话描述这个方法的作用)
    * @param @param eqpId
    * @param @return    设定文件
    * @return List<EqpInprocessLot>    返回类型
    * @throws
     */
    List<EqpInprocessLot> listInprLotByEqp(@Param("eqpId") String eqpId);
    
    /**
    * @Title: listAlarmHis
    * @Description: 
    * @param @param eqpId
    * @param @return    设定文件
    * @return List<AlrmHisInfo>    返回类型
    * @throws
     */
    List<AlrmHisInfo> listAlarmHis(String eqpId);

    List<String> listPortStates();

    List<String> listEqpCategory();
    List<String> listEqpMode();

    McpInfo getMcpInfo(String mcpName);

    List<VehicleInfo> listVehicleInfo(String mcpName);

    List<StationInfo> listMcpStation(String mcpName);
}
