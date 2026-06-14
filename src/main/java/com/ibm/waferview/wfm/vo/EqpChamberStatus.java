/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年9月24日 下午3:19:30
 */
@Data
public class EqpChamberStatus implements Serializable
{
    /**
    * 
    */
    private static final long serialVersionUID = 1L;
    
    private String eqpId;
    private String eqpName;
    private String chamberId;
    private String processId;
    private String e10State;
    private String eqpStateId;                    //   

//    private String e10StateColor = "#fff";
    private String eqpStateIdColor = "#fff";      // Chamber 状态的颜色.

}
