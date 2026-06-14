package com.ibm.waferview.wfm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibm.waferview.wfm.vo.ColorDefine;
@Mapper
public interface WfmColorMapper
{

    /**
     * @param
     * @return
     */
    List<ColorDefine> listColorDefines();

    List<String> listEqpStates();
    
//    int updateColorDefine(@Param("colorDefines") List<ColorDefine> colorDefines);

    /**
     * @param
     */
    int deleteColorDefine(@Param("colorDefines") List<ColorDefine> colorDefines);

    /**
     * 
     * @param
     * @return
     */
    int batchAddColorDefines(@Param("colorDefines") List<ColorDefine> colorDefines);

}
