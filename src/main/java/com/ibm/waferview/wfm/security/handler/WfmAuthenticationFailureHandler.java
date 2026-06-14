package com.ibm.waferview.wfm.security.handler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class WfmAuthenticationFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
//        httpServletResponse.setHeader("Content-Type", "application/json;charset=utf-8");
//        httpServletResponse.getWriter().print("{\"code\":1,\"message\":\""+e.getMessage()+"\"}");
//        httpServletResponse.getWriter().flush();
//        httpServletResponse.setHeader("Content-Type", "application/json;charset=utf-8");
//        ResultVo responseBean=new ResultVo(401,"验证失败",null,null);
//        httpServletResponse.getWriter().write(JSON.toJSONString(responseBean));
//        httpServletResponse.getWriter().flush();
    	log.info("-------------------系统登录失败---------------");
    	httpServletResponse.sendRedirect("/wfm-component-client/service/auth/login");
    }
}
