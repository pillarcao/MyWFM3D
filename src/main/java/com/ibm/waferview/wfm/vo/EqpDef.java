/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import com.alibaba.druid.util.StringUtils;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年9月23日 下午1:13:18
 */
@Data
public class EqpDef implements Serializable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private String eqpId;
    private String eqpType;
    private String e10State;
    private String eqpDesc;
//    private String enable;
    private String lastUser;
    private String lastDatetime;
    private String eqpName;
    private String eqpMode;
    private String recipId;
	public String getLastDatetime() {
		return lastDatetime;
	}
	public void setLastDatetime(String lastDatetime) {
		if(!StringUtils.isEmpty(lastDatetime)) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				this.lastDatetime = sdf.format(sdf.parse(lastDatetime));
			} catch (ParseException e) {
				this.lastDatetime = lastDatetime;
			}
		}else {
			this.lastDatetime = lastDatetime;
		}
	}
    
}
