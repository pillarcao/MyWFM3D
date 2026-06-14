package com.ibm.waferview.wfm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibm.waferview.wfm.vo.EqpDef;
import com.ibm.waferview.wfm.vo.UserEqpRelDef;
@Mapper
public interface EquipmentMapper {

    /**
     * @param eqpDef
     * @return
     */
    List<String> listEqpIds(EqpDef eqpDef);

    /**
     * 
    * @Title: listEqp
    * @Description: TODO(这里用一句话描述这个方法的作用)
    * @param @param eqpDef
    * @param @return    设定文件
    * @return List<String>    返回类型
    * @throws
     */
    List<EqpDef> listEqp(EqpDef eqpDef);
    /**
     * @param userId
     * @return
     */
    List<UserEqpRelDef> listEqpIdsByUserId(@Param("userId") String userId);

    /**
     * @param userId
     */
    int deleteUserEqpsByUserId(@Param("userId") String userId);
    
    /**
     * 
     * @param userId
     * @param eqpIds
     * @return
     */
    int batchAddUserEqps(@Param("userId") String userId,  @Param("eqpIds") List<String> eqpIds);
    
}
