package com.ibm.waferview.wfm.vo;

import lombok.Data;

@Data
public class StationInfo {
    private String stationID;
    private String mcpPort;
    private String state;
    private String carID;
    private String carStats;
    private String destPortID;
    private String color;
}
