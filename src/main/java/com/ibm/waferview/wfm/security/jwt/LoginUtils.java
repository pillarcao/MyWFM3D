package com.ibm.waferview.wfm.security.jwt;

import com.ibm.waferview.wfm.utils.ApplicationContextUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import javax.servlet.http.HttpServletRequest;
public class LoginUtils {
	public static String getUsername(HttpServletRequest request) {
		String token = request.getHeader("Authorization").substring("Bearer".length());
    	if("".equals(token)) {
    		token=  request.getParameter("token").substring("Bearer".length());
    	}
//		ResourceBundle properties = ResourceBundle.getBundle("application");
//		String secret = properties.getString("jwt.secret");
		String secret = ApplicationContextUtils.getProp("jwt.secret");
		String username;
		try {
			Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
			username = claims.getSubject();
		} catch (Exception e) {
			username = null;
		}
		return username;

	}
}
