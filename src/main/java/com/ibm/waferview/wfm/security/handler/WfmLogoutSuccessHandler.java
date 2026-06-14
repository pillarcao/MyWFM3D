package com.ibm.waferview.wfm.security.handler;

import com.alibaba.fastjson.JSON;
import com.ibm.waferview.wfm.security.bean.ResultVo;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


public class WfmLogoutSuccessHandler implements LogoutSuccessHandler {
    @Override
    public void onLogoutSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
        
        HttpSession session = httpServletRequest.getSession(false);
        if (session != null) {
            session.removeAttribute("wfm-token");
            session.removeAttribute("wfm-current-userId");
            session.removeAttribute("wfm-userPrivilege");
            session.removeAttribute("wfm-language");
        }
        
        httpServletResponse.setHeader("Content-Type", "application/json;charset=utf-8");
        ResultVo responseBean=new ResultVo(200,"注销成功",null,null);
        httpServletResponse.getWriter().write(JSON.toJSONString(responseBean));
        httpServletResponse.getWriter().flush();

    }
}
