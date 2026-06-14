/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年9月23日 下午1:13:18
 */
@Data
public class EqpInfo implements Serializable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private String eqpId;
    private List<String> portList = new LinkedList<String>();
    private List<String> chamberList = new LinkedList<String>();
}
