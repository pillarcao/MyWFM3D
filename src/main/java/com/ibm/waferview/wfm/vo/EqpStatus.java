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
public class EqpStatus implements Serializable
{
    /**
    * 
    */
    private static final long serialVersionUID = 1L;
    
    private String eqpId;
    private String eqpName;
    private String eqpCategory;    // 机台分类.
    private String eqpMode;        // 机台模式
//    private Integer batchSizeMax;
    private String e10State;
    private String curStateId;      // ***** 表示当前机台状态. 
    private String stateChgTime;    // 机台状态切换的时间. 
    
    private String stateChgTime4Text;
    
    private String eqpCategoryColor = "#777";    // 机台分类的颜色. 
    
//    private String e10StateColor = "#fff";
    private String curStateIdColor = "#fff";     // 机台当前状态的颜色. 
    
    private String fontColor = "#000";           // 前景色.

    private String eqpModeColor = "#888";

}
