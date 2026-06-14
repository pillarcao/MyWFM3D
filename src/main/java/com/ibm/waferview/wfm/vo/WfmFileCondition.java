/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年11月12日 上午9:17:19
 */
@Data
public class WfmFileCondition extends WfmFileInfo implements Serializable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    private String[] md5sumList         ; // md5Array ;
    private Integer  invalidDays        ;
    private String[] fileContents       ; // md5Array ;
    private String   floorNo;            //楼层号
}
