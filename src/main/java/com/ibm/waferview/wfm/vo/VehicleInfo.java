package com.ibm.waferview.wfm.vo;

import lombok.Data;

@Data
public class VehicleInfo {
    private String vehicleName;
    private String state;
    private String emptyFlag;
    private String currentLocation;
    private int    currentDistance;
    private String nextLocation;
    private String carID;
    private String dest;
    private String fillColor;
}
