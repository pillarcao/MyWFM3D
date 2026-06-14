package com.ibm.waferview.wfm.security.handler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import com.alibaba.fastjson.JSON;
import com.ibm.waferview.wfm.security.bean.ResultVo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class WfmAuthenticationEntryPoint implements AuthenticationEntryPoint
{
    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
            AuthenticationException e) throws IOException, ServletException
    {

        log.info("-------------------系统登录失败---------------");

//        HttpSession session = httpServletRequest.getSession(false);
//        if (session != null) {
//            session.removeAttribute("wfm-token");
//            session.removeAttribute("wfm-current-userId");
//            session.removeAttribute("wfm-userPrivilege");
//            session.removeAttribute("wfm-language");
//            
//            // Regenerate new session,   // zhuxiuhong 2020/07/30 06:24 
//            session.invalidate();
//            if( httpServletRequest.getCookies() != null && httpServletRequest.getCookies()[0] != null){
//                httpServletRequest.getCookies()[0].setMaxAge(0);
//            }
//            session = httpServletRequest.getSession();
//        }

        try {
            if( httpServletRequest.getRequestURL().toString().contains("/auth/token") 
                   // || httpServletRequest.getRequestURL().toString().contains("api/welcome") 
                   ) {
                   
                httpServletResponse.setHeader("Content-Type", "application/json;charset=utf-8");
                ResultVo responseBean=new ResultVo(403,"没有权限访问该资源",null,null);
                httpServletResponse.getWriter().write(JSON.toJSONString(responseBean));
                httpServletResponse.getWriter().flush();
                
            }else {
            
                log.info("-------------sendRedirect(\"/wfm-component-client/service/auth/login\")--");
                httpServletResponse.sendRedirect("/wfm-component-client/service/auth/login");
                
            }
        } catch (Exception e2) {
             httpServletResponse.setHeader("Content-Type", "application/json;charset=utf-8");
             ResultVo responseBean=new ResultVo(403,"没有权限访问该资源",null,null);
             httpServletResponse.getWriter().write(JSON.toJSONString(responseBean));
             httpServletResponse.getWriter().flush();
        }
        return;
    }
}
