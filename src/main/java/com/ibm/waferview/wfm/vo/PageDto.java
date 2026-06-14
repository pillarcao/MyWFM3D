/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年8月25日 下午10:34:54
 */
@Data
public class PageDto implements Serializable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private Integer start;
    private Integer length;
    private Integer end;
    private Integer draw;

}
