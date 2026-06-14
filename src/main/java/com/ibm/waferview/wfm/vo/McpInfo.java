package com.ibm.waferview.wfm.vo;

import lombok.Data;

import java.util.List;

@Data
public class McpInfo {
    private String mcpName;
    private String crtlState;
    private String tcsState;
    private String alarmState;
    private String fillColor;
    private List<VehicleInfo> vehicleList;
    private List<StationInfo> stationList;
}
