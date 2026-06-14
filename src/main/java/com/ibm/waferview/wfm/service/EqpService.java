package com.ibm.waferview.wfm.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.ibm.waferview.wfm.vo.EqpDef;

@Service
public interface EqpService {

    /**
     * @return
     */
    List<String> listEqpIds(EqpDef eqpDef);

    List<EqpDef> listEqp(EqpDef eqpDef);

    /**
     * @param userId
     * @return
     */
    List<String> listEqpIdsByUserId(String userId);

    /**
     * @param userId
     * @param userEqpRelDefs
     */
    void updateUserEqps(String userId, List<String> userEqpRelDefs);
	
}
