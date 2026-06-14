package com.ibm.waferview.wfm.security.handler;

import com.alibaba.fastjson.JSON;
import com.ibm.waferview.wfm.security.bean.ResultVo;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class WfmAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AccessDeniedException e) throws IOException, ServletException {
        httpServletResponse.setHeader("Content-Type", "application/json;charset=utf-8");
        ResultVo responseBean=new ResultVo(403,"您的权限不足，无法访问该资源",null,null);
        httpServletResponse.getWriter().write(JSON.toJSONString(responseBean));
        httpServletResponse.getWriter().flush();
    }
}
