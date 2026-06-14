/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年8月25日 下午9:31:01
 */
@Data
public class WfmDataTable implements Serializable
{

    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private String status;
    private String draw;
    private Integer recordsTotal;
    private Integer recordsFiltered;
    private List<?> data;

    public WfmDataTable(List<?> data, Integer recordsTotal, Integer recordsFiltered, String draw) {
        this.data = data;
        this.status  = "success";
        this.recordsTotal = recordsTotal;
        this.recordsFiltered = recordsFiltered;
        this.draw = draw;
    }

}
