package com.ibm.waferview.wfm.vo;


import java.io.Serializable;

import lombok.Data;

@Data
public class Menu implements Serializable{
	/**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    private String menuId;
	private String menuName;
	private String href;
	private String menuDesc;
	private String menuType;
	private int menuLvl;
	private String parentId;
	private String enable;
	private int showOrder;
	private String privid;
}
