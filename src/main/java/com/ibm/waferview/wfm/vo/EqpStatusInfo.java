/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年9月24日 下午5:39:24
 */
@Data
public class EqpStatusInfo implements Serializable
{
    /**
    * 
    */
    private static final long serialVersionUID = 1L;
    
    private EqpStatus eqpStatus;
    private List<EqpPortStatus> eqpPortStatusList;
    private Integer  inprocessLotCnt;
    private List<String> inprocessLotIds;
    private List<EqpChamberStatus> eqpChamberStatusList;
    private Integer  wipCnt = 0;
    
    private List<EqpLotCount>  wipCntList;
    
}
