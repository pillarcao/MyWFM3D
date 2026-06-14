package com.ibm.waferview.wfm.service.impl;

import java.util.LinkedList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ibm.waferview.wfm.dao.EquipmentMapper;
import com.ibm.waferview.wfm.vo.EqpDef;
import com.ibm.waferview.wfm.vo.UserEqpRelDef;
import com.ibm.waferview.wfm.service.EqpService;

import lombok.extern.slf4j.Slf4j;

@Service("eqpService")
@Slf4j
public class EqpServiceImpl implements EqpService
{
    @Resource
    EquipmentMapper equipmentMapper;

    /*  
     * @Author zhuxiuhong
     * @Since 2020年9月23日 下午4:23:30
     * @see com.ibm.waferview.wfm.service.EqpService#listEqpIds()
     */
    @Override
    public List<String> listEqpIds(EqpDef eqpDef)
    {
        return equipmentMapper.listEqpIds(eqpDef);
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年9月23日 下午4:23:30
     * @see com.ibm.waferview.wfm.service.EqpService#listEqpIdsByUserId(java.lang.String)
     */
    @Override
    public List<String> listEqpIdsByUserId(String userId)
    {
        List<String> ids = new LinkedList<>();
        List<UserEqpRelDef> list = equipmentMapper.listEqpIdsByUserId(userId);
        for(UserEqpRelDef u: list) {
            if(ids.contains(u.getEqpId())) {
                continue;
            }
            ids.add(u.getEqpId());
        }
        log.info("listEqpIdsByUserId: {}", ids);
        return ids;
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年9月23日 下午4:23:30
     * @see com.ibm.waferview.wfm.service.EqpService#updateUserEqps(java.util.List)
     */
    @Override
    @Transactional
    public void updateUserEqps(String userId, List<String> eqpIds)
    {
        int cnt = equipmentMapper.deleteUserEqpsByUserId(userId);
        log.info(" deleteUserEqpsByUserId: ret = {}", cnt );
        cnt = equipmentMapper.batchAddUserEqps(userId, eqpIds);
        log.info(" batchAddUserEqps: ret = {}", cnt );
    }

	@Override
	public List<EqpDef> listEqp(EqpDef eqpDef) {
		return equipmentMapper.listEqp(eqpDef);
	}
 

}
