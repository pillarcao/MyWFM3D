/**
 * Copyright 2018-2025 IBM.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2021年10月29日 23:53:18
 */
@Data
public class EqpStatusChangeHis implements Serializable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private String  eventCreateTime   ;
    private String  areaId            ;
    private String  eqpId             ;
    private String  claimUserId       ;
    private String  claimMemo         ;
    
    private String  e10State          ;   // 上一次的E10状态
    private String  eqpState          ;   // 上一次的 EqpState 
    
    private String  newE10State       ;   // 当前最新的 E10 状态
    private String  newEqpmentState   ;   // 当前最新的 EqpmentState
    private String  startTime         ;
    private String  endTime           ;
}
