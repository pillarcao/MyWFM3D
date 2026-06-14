package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import lombok.Data;


@Data
public class UserPrivilege implements Serializable{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    String functionId;
    String permission;
}