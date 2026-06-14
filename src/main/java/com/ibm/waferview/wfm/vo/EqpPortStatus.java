/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年9月24日 下午3:19:10
 */
@Data
public class EqpPortStatus implements Serializable
{
    /**
    * 
    */
    private static final long serialVersionUID = 1L;
    
    private String eqpId;
    private String portId;
    private String portState;
    private String mcpPortID;
    private String portStateColor = "#fff";
    
}
