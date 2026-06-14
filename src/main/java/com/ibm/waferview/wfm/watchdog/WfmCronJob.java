package com.ibm.waferview.wfm.watchdog;

import java.util.List;

import com.ibm.waferview.wfm.vo.McpInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import com.ibm.waferview.wfm.constant.Constants;
import com.ibm.waferview.wfm.service.EqpService;
import com.ibm.waferview.wfm.service.MonitorService;
import com.ibm.waferview.wfm.utils.FileUtil;
import com.ibm.waferview.wfm.utils.JsonUtil;
import com.ibm.waferview.wfm.vo.EqpDef;
import com.ibm.waferview.wfm.vo.EqpStatusInfo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableScheduling   // 2.开启定时任务
public class WfmCronJob{
   
	@Autowired
    public EqpService eqpService;
	
	@Autowired
	public MonitorService monitorService;
	
    /**
     * 定期更新 EQP的状态.
     */
	@Scheduled(cron = "${eqpstatusupdate.schedules}")
	public void execute() {
		try {
			log.info("--------------eqpStatesUpdateJob-Start---------------");
			//1.0 Get Eqp ID list
			List<String> allEqpList = eqpService.listEqpIds(new EqpDef());
			//2.0 Query Eqp Information
			List<EqpStatusInfo> list = monitorService.listEqpStatusInfo(allEqpList.toArray(new String[0]));
			//3.0 Write States File
			if (!FileUtil.writeString(Constants.KEY_FILE_STAT_JSON, JsonUtil.toJson(list))) {
				log.error("Eqp States File Update error");
			}
			log.info("--------------eqpStatesUpdateJob-Done---------------");
		} catch (Exception e) {
			e.printStackTrace();
			log.error("Error listEqpStatesInfo:{}", e.toString());
			log.error("Trace:{}", e.getStackTrace()[0].toString());
		}
	}
	@Scheduled(cron = "${updateVehicleData.schedules}")
	public void updateVehicleData()
	{
		try {
			//1.0 Write mcp File
			McpInfo mcp = monitorService.getMcpInfo();
			if (!FileUtil.writeString(Constants.KEY_FILE_MCP_JSON, JsonUtil.toJson(mcp))) {
				log.error("Write mcp File error");
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("Error updateVehicleData:{}", e.toString());
			log.error("Trace:{}", e.getStackTrace()[0].toString());
		}
	}
	
}
