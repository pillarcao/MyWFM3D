/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年10月21日 下午2:13:15
 */
@Data
public class MiscData implements Serializable
{

    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private String category;
    private String item;
    private String value;
    private String showOrder = "99";
    private String value1 = "";
    private String value2 = "";
    private String value3 = "";
    private String value4 = "";
    private String memo = "";
    private String enable = "Y";
    private String lastUser;
    private String lastDatetime;

}
