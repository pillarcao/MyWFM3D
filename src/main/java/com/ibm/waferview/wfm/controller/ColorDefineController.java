package com.ibm.waferview.wfm.controller;

import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ibm.waferview.wfm.vo.ColorDefine;
import com.ibm.waferview.wfm.security.jwt.LoginUtils;
import com.ibm.waferview.wfm.service.ColorDefineService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class ColorDefineController extends BaseController
{
    @Autowired
    ColorDefineService colorDefineService;

    @RequestMapping(value = "/wfm_color_def", method = RequestMethod.GET)
    public ModelAndView loadWfmColorDefView(HttpServletRequest request)
    {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/setting/color_def");
        return mv;
    }

    /**
     * 
     * @param request
     * @return
     */
    @RequestMapping(value = "/listColorDefs", method = RequestMethod.POST)
    public List<ColorDefine> listColorDefs(HttpServletRequest request)
    {
//        log.info("listColorDef:");
//        return colorDefineService.listColorDefs();
        return colorDefineService.listAllColorDef();
    }

    @RequestMapping(value = "/updateColorDefs", method = RequestMethod.POST)
    public int updateColorDefs(HttpServletRequest request, String[] items)
    {
        log.info("updateColorDefList:");
        if (items == null || items.length == 0) {
            return 0;
        }

        // List<ColorDefine> colorDefines = colorDefineService.listColorDefs();

        String userId = LoginUtils.getUsername(request);
        List<ColorDefine> colorDefineList = new LinkedList<>();
        for (int i = 0; (i + 2) < items.length; i += 6) {
            ColorDefine c = new ColorDefine(items[i], items[i + 1], items[i + 2]);

            c.setColor(items[i + 2]);

            c.setShowOrder(Integer.parseInt(items[i + 3]));
            c.setExtField(items[i + 4]);
            c.setDefaultColor(items[i + 5]);

            c.setLastUser(userId);
            colorDefineList.add(c);
        }

        return colorDefineService.updateColorDefs(colorDefineList);

    }

}
