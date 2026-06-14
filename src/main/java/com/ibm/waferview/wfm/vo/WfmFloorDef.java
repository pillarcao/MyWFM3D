
package com.ibm.waferview.wfm.vo;

import lombok.Data;

import java.io.Serializable;

 @Data
public class WfmFloorDef implements Serializable
{

    private static final long serialVersionUID = 1L;
    
    private String floorId;
    private String floorName;
    private String floorNo;
    private String validFlag;
    private String lastUser;
    private String lastDatetime;
}
