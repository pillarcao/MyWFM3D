package com.ibm.waferview.wfm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibm.waferview.wfm.vo.MiscData;
@Mapper
public interface WfmMiscMapper
{

    List<MiscData> listMiscData(MiscData miscData);
    List<MiscData> listMiscDataByItems(@Param("category") String category, @Param("items") String[] items);
    
    List<MiscData> getMiscData(@Param("category") String category, @Param("item") String item);
    
    int updateMiscData(MiscData miscData);
    
}
