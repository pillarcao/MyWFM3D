package com.ibm.waferview.wfm.service.impl;

import java.util.LinkedList;
import java.util.List;

import javax.annotation.Resource;

import com.ibm.waferview.wfm.utils.StringUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ibm.waferview.wfm.constant.Constants;
import com.ibm.waferview.wfm.dao.WfmColorMapper;
import com.ibm.waferview.wfm.dao.WfmMonitorMapper;
import com.ibm.waferview.wfm.vo.ColorDefine;
import com.ibm.waferview.wfm.vo.EqpStateDefine;
import com.ibm.waferview.wfm.service.ColorDefineService;

@Service("colorDefineService")
//@Slf4j
public class ColorDefineServiceImpl implements ColorDefineService
{
    @Resource
    WfmColorMapper colorMapper;
    
    @Resource
    @Lazy
    WfmMonitorMapper monitorMapper;

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月23日 上午10:12:27
     * @see com.ibm.waferview.wfm.service.ColorDefineService#listColorDefines()
     */
    @Override
    public List<ColorDefine> listColorDefs()
    {
        List<ColorDefine> colorDefines = colorMapper.listColorDefines();
        List<EqpStateDefine> eqpStateDefs = monitorMapper.listEqpStateDef();
        List<String> currentEqpStates_fg = new LinkedList<>();
        List<String> currentEqpStates_bg = new LinkedList<>();
        for( EqpStateDefine s: eqpStateDefs) {
            currentEqpStates_fg.add(s.getE10StateId());
            currentEqpStates_bg.add(s.getE10StateId());
        }
        
        /*
          对比 MESREQPST 中的 E10_STATE_ID 和 EQPSTATE_ID
          整理 colorDefines
          */
        int showOrder = 1;
        for(int i = colorDefines.size() -1; i >= 0;  --i) {
            ColorDefine c = colorDefines.get(i);
            if( !c.getCategory().equals(Constants.COLOR_EQP_STATE_BG)) {
                continue;
            }
            if(currentEqpStates_bg.contains(StringUtils.toStringAndTrim(c.getItem()))) {
                showOrder = c.getShowOrder();
                currentEqpStates_bg.remove(StringUtils.toStringAndTrim(c.getItem()));
            }else {
                colorDefines.remove(c);
            }
        }
        if( !currentEqpStates_bg.isEmpty() ) {
             for(String s: currentEqpStates_bg ) {
                 ColorDefine c = new ColorDefine(Constants.COLOR_EQP_STATE_BG, s, "#FEFEFE");
                 c.setShowOrder( ++ showOrder);
                 c.setExtField("");
                 c.setDefaultColor("");
                 colorDefines.add(c);
             }
        }

        showOrder = 1;
        for(int i = colorDefines.size() -1; i >= 0;  --i) {
            ColorDefine c = colorDefines.get(i);
            if( !c.getCategory().equals(Constants.COLOR_EQP_STATE_FG)) {
                continue;
            }
            if(currentEqpStates_fg.contains(c.getItem())) {
                showOrder = c.getShowOrder();
                currentEqpStates_fg.remove(c.getItem());
            }else {
                colorDefines.remove(c);
            }
        }
        if( !currentEqpStates_fg.isEmpty() ) {
            for(String s: currentEqpStates_fg ) {
                 ColorDefine c = new ColorDefine(Constants.COLOR_EQP_STATE_FG, s, "#010101");
                 c.setShowOrder( ++ showOrder);
                 c.setExtField("");
                 c.setDefaultColor("");
                 colorDefines.add(c);
            }
        }
        //Port State
        //1.0 Get all port states
        List<String> pts = monitorMapper.listPortStates();
        //2.0 Get set port color
        showOrder = 1;
        for(String pt:pts) {
            boolean portStateFlag = false;
            for(ColorDefine cd:colorDefines){
                if(StringUtils.isMatch(Constants.COLOR_EQP_PORT_STATE_BG,cd.getCategory())
                    && StringUtils.isMatch(pt,cd.getItem())){
                    portStateFlag = true;
                    showOrder++;
                    break;
                }
            }
            if(!portStateFlag){
                ColorDefine c = new ColorDefine(Constants.COLOR_EQP_PORT_STATE_BG, pt, "#FEFEFE");
                c.setShowOrder(showOrder++);
                c.setExtField("");
                c.setDefaultColor("");
                colorDefines.add(c);
            }
        }
        //Eqp Category
        //3.0 Get all Eqp category
//        List<String> cats = monitorMapper.listEqpCategory();
        //4.0 Get set Cate color
//        showOrder = 1;
//        for(String cat:cats) {
//            boolean cateFlag = false;
//            for(ColorDefine cd:colorDefines){
//                if(StringUtils.isMatch(Constants.COLOR_EQP_CATEGORY,cd.getCategory())
//                        && StringUtils.isMatch(cat,cd.getItem())){
//                    cateFlag = true;
//                    break;
//                }
//            }
//            if(!cateFlag){
//                ColorDefine c = new ColorDefine(Constants.COLOR_EQP_CATEGORY, cat, "#010101");
//                c.setShowOrder(showOrder++);
//                c.setExtField("");
//                c.setDefaultColor("");
//                colorDefines.add(c);
//            }
//        }
        //Eqp Mode
        List<String> modes = monitorMapper.listEqpMode();
        showOrder = 1;
        for(String mode:modes) {
            boolean modeFlag = false;
            for(ColorDefine cd:colorDefines){
                if(StringUtils.isMatch(Constants.COLOR_EQP_MODE,cd.getCategory())
                        && StringUtils.isMatch(mode,cd.getItem())){
                    modeFlag = true;
                    showOrder++;
                    break;
                }
            }
            if(!modeFlag){
                ColorDefine c = new ColorDefine(Constants.COLOR_EQP_MODE, mode, "#010101");
                c.setShowOrder(showOrder++);
                c.setExtField("");
                c.setDefaultColor("");
                colorDefines.add(c);
            }
        }

        return colorDefines;
    }

    @Override
    public List<ColorDefine> listAllColorDef() {
        List<ColorDefine> colorDefines = colorMapper.listColorDefines();
        List<String> eqpStates = colorMapper.listEqpStates();
        List<String> currentEqpStates_fg = new LinkedList<>();
        List<String> currentEqpStates_bg = new LinkedList<>();
        for( ColorDefine cd: colorDefines) {
            if(StringUtils.isMatch(Constants.COLOR_EQP_STATE_BG,cd.getCategory()))
            {
                currentEqpStates_bg.add(cd.getItem());
            }
            if(StringUtils.isMatch(Constants.COLOR_EQP_STATE_FG,cd.getCategory()))
            {
                currentEqpStates_fg.add(cd.getItem());
            }
        }
        int showOrder = 1;
        for(String bg:eqpStates) {
            boolean bgFlag = false;
            for(String s:currentEqpStates_bg){
                if(StringUtils.isMatch(bg,s)){
                    bgFlag = true;
                    showOrder++;
                    break;
                }
            }
            if(!bgFlag){
                ColorDefine c = new ColorDefine(Constants.COLOR_EQP_STATE_BG, bg, "#FEFEFE");
                c.setShowOrder(showOrder++);
                c.setExtField("");
                c.setDefaultColor("");
                colorDefines.add(c);
            }
        }
        showOrder = 1;
        for(String fg:eqpStates) {
            boolean fgFlag = false;
            for(String s:currentEqpStates_fg){
                if(StringUtils.isMatch(fg,s)){
                    fgFlag = true;
                    showOrder++;
                    break;
                }
            }
            if(!fgFlag){
                ColorDefine c = new ColorDefine(Constants.COLOR_EQP_STATE_FG, fg, "#010101");
                c.setShowOrder(showOrder++);
                c.setExtField("");
                c.setDefaultColor("");
                colorDefines.add(c);
            }
        }
        //Port State
        //1.0 Get all port states
        List<String> pts = monitorMapper.listPortStates();
        //2.0 Get set port color
        showOrder = 1;
        for(String pt:pts) {
            boolean portStateFlag = false;
            for(ColorDefine cd:colorDefines){
                if(StringUtils.isMatch(Constants.COLOR_EQP_PORT_STATE_BG,cd.getCategory())
                        && StringUtils.isMatch(pt,cd.getItem())){
                    portStateFlag = true;
                    showOrder++;
                    break;
                }
            }
            if(!portStateFlag){
                ColorDefine c = new ColorDefine(Constants.COLOR_EQP_PORT_STATE_BG, pt, "#FEFEFE");
                c.setShowOrder(showOrder++);
                c.setExtField("");
                c.setDefaultColor("");
                colorDefines.add(c);
            }
        }
        //Eqp Category
        //3.0 Get all Eqp category
//        List<String> cats = monitorMapper.listEqpCategory();
        //4.0 Get set Cate color
//        showOrder = 1;
//        for(String cat:cats) {
//            boolean cateFlag = false;
//            for(ColorDefine cd:colorDefines){
//                if(StringUtils.isMatch(Constants.COLOR_EQP_CATEGORY,cd.getCategory())
//                        && StringUtils.isMatch(cat,cd.getItem())){
//                    cateFlag = true;
//                    break;
//                }
//            }
//            if(!cateFlag){
//                ColorDefine c = new ColorDefine(Constants.COLOR_EQP_CATEGORY, cat, "#010101");
//                c.setShowOrder(showOrder++);
//                c.setExtField("");
//                c.setDefaultColor("");
//                colorDefines.add(c);
//            }
//        }
        //Eqp Mode
        List<String> modes = monitorMapper.listEqpMode();
        showOrder = 1;
        for(String mode:modes) {
            boolean modeFlag = false;
            for(ColorDefine cd:colorDefines){
                if(StringUtils.isMatch(Constants.COLOR_EQP_MODE,cd.getCategory())
                        && StringUtils.isMatch(mode,cd.getItem())){
                    modeFlag = true;
                    showOrder++;
                    break;
                }
            }
            if(!modeFlag){
                ColorDefine c = new ColorDefine(Constants.COLOR_EQP_MODE, mode, "#FEFEFE");
                c.setShowOrder(showOrder++);
                c.setExtField("");
                c.setDefaultColor("");
                colorDefines.add(c);
            }
        }
        return colorDefines;
    }


    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月23日 上午10:12:27
     * @see com.ibm.waferview.wfm.service.ColorDefineService#deleteColorDefine(java.util.List)
     */
    @Override
    @Transactional
    public int deleteColorDefine(List<ColorDefine> colorDefines)
    {
        return colorMapper.deleteColorDefine(colorDefines);
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月23日 上午10:12:27
     * @see com.ibm.waferview.wfm.service.ColorDefineService#batchAddColorDefines(java.util.List)
     */
    @Override
    @Transactional
    public int batchAddColorDefines(List<ColorDefine> colorDefines)
    {
        return colorMapper.batchAddColorDefines(colorDefines);
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月23日 上午10:17:03
     * @see com.ibm.waferview.wfm.service.ColorDefineService#updateColorDefs(java.util.List)
     */
    @Override
    @Transactional
    public int updateColorDefs(List<ColorDefine> colorDefines)
    {
        deleteColorDefine(colorDefines);
        return batchAddColorDefines(colorDefines);
    }

}
