/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年9月23日 下午1:29:41
 */
@Data
public class UserEqpRelDef implements Serializable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    private String userId;
    private String eqpId;
    private Integer showOrder;
    private String lastUser;
    private String lastDatetime;

}
