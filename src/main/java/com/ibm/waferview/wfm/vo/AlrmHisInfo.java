package com.ibm.waferview.wfm.vo;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import com.alibaba.druid.util.StringUtils;


import lombok.Data;

@Data
public class AlrmHisInfo implements Serializable
{
    /**
    * 
    */
    private static final long serialVersionUID = 1L;

    private String eqpId;
    private String almId;
    private String almCode;
    private String almStat;
    private String almDttm;
    private String almText;
    
    public String getAlmDttm() {
		return almDttm;
	}
	public void setAlmDttm(String almDttm) {
		if(!StringUtils.isEmpty(almDttm)) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				this.almDttm = sdf.format(sdf.parse(almDttm));
			} catch (ParseException e) {
				this.almDttm = almDttm;
			}
		}else {
			this.almDttm = almDttm;
		}
	}
}
