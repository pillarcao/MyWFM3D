package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class User implements Serializable{
	/**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    private String userId;
	private String passwd;
	private String userName;
	private String mailAddress;
	private String department;
	private String telNo1;
	private String telNo2;
	private String telNo3;
	private String smsNo;
	private String wechatId;
	private String lineId;
	private String enable="Y";
	private String lastUser;
	private String lastDatetime;
}
