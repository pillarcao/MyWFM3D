package com.ibm.waferview.wfm.dao;

import com.ibm.waferview.wfm.vo.WfmFloorDef;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WfmFloorDefMapper
{
    List<WfmFloorDef> listFloorInfo();

}
