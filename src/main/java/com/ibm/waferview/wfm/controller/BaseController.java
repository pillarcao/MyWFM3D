package com.ibm.waferview.wfm.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.ibm.waferview.wfm.vo.User;
import com.ibm.waferview.wfm.security.jwt.JwtTokenUtil;
import com.ibm.waferview.wfm.service.base.api.BaseApi;

public class BaseController extends BaseApi<User>{
	@Autowired
	JwtTokenUtil jwtTokenUtil;

	protected ModelAndView page(String model) {
		ModelAndView mv = new ModelAndView();
		mv.setViewName(model);
		return mv;
	}

	protected String getUsername(HttpServletRequest request) {
		String token = request.getHeader("Authorization");
		String username=null;
		if(StringUtils.isNotEmpty(token)) {
		  username = jwtTokenUtil.getUsernameFromToken(token);
		}
		return username;
	}
}
