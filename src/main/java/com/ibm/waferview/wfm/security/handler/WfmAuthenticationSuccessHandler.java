package com.ibm.waferview.wfm.security.handler;

import com.alibaba.fastjson.JSON;
import com.ibm.waferview.wfm.security.bean.ResultVo;
import com.ibm.waferview.wfm.security.jwt.JwtTokenUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class WfmAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Autowired
    JwtTokenUtil jwtTokenUtil;
    /**
     * //有效期
     */
    @Value("${jwt.expiration}")
    private Long expiration;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
        httpServletResponse.setHeader("Content-Type", "application/json;charset=utf-8");
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtTokenUtil.generateToken(userDetails);
        //jwtTokenUtil.setExpire(jwtToken,userDetails.getUsername(),expiration+100000);
        //ResultVo responseBean = new ResultVo(200, "登录成功", jwtToken);
        //httpServletResponse.getWriter().write(JSON.toJSONString(responseBean));
        //httpServletResponse.getWriter().flush();
    }
}
