package com.ibm.waferview.wfm.service;

import java.util.List;

import com.ibm.waferview.wfm.vo.ColorDefine;

public interface ColorDefineService
{

    List<ColorDefine> listColorDefs();
//    List<ColorDefine> listDefaultColorDefs();

    List<ColorDefine> listAllColorDef();

    int deleteColorDefine(List<ColorDefine> colorDefines);

    int batchAddColorDefines(List<ColorDefine> colorDefines);

    int updateColorDefs(List<ColorDefine> colorDefines);

}
