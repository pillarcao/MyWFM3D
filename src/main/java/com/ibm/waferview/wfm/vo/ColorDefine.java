/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import com.ibm.waferview.wfm.utils.StringUtils;
import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年9月27日 下午4:31:36
 */
@Data
public class ColorDefine implements Serializable
{
    /**
    * 
    */
    private static final long serialVersionUID = 1L;
    
    private String category;
    private String item;
    private String color;
    private String extField;
    private Integer showOrder;
    
    private String lastUser;
    private String lastDatetime;
    
    private String defaultColor;
    
    public ColorDefine() {}
    
    public ColorDefine(String category, String item, String color) {
        this.category = category;
        this.item = StringUtils.toStringAndTrim(item);
        this.color = color;
    }

}
