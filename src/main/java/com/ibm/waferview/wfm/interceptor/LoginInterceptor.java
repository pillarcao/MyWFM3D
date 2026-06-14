package com.ibm.waferview.wfm.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

public class LoginInterceptor implements HandlerInterceptor {
	
	private List<String> allowedPass;
	
	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3) {
	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3) {
	}
	
	//确认哪些URL不被拦截，哪些需要被拦截
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object arg2) throws Exception {
		String url = request.getRequestURL().toString();
		//先判断session中是否有
		Object user = request.getSession().getAttribute("user");
		if(user!=null) {
			return true;
		}
		for(String temp:allowedPass) {
			if(url.endsWith(temp)) {
				return true;
			}
		}
		response.sendRedirect(request.getContextPath()+"/login.jsp");
		return false;
	}

	public void setAllowedPass(List<String> allowedPass) {
		this.allowedPass = allowedPass;
	}
	
}
