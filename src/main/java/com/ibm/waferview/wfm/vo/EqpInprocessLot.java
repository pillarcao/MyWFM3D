/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import com.alibaba.druid.util.StringUtils;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年10月30日 下午4:48:31
 */
@Data
public class EqpInprocessLot
{
    private String eqpId;
    private String theSystemKey;
    private String inprocessLotId;
    private String subLotId;
    private String curSublotWafCnt;
    private String opeStartPortId;
    private String opeStartDttm;
    private String opeStartUserId;
    private String carId;
	public String getOpeStartDttm() {
		return opeStartDttm;
	}
	public void setOpeStartDttm(String opeStartDttm) {
		if(!StringUtils.isEmpty(opeStartDttm)) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				this.opeStartDttm = sdf.format(sdf.parse(opeStartDttm));
			} catch (ParseException e) {
				this.opeStartDttm = opeStartDttm;
			}
		}else {
			this.opeStartDttm = opeStartDttm;
		}
	}
}
