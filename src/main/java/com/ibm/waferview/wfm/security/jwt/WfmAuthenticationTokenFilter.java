package com.ibm.waferview.wfm.security.jwt;


import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.extern.slf4j.Slf4j;


@Component
//@PropertySource(value = {"classpath:application.properties"})
@Slf4j
public class WfmAuthenticationTokenFilter extends OncePerRequestFilter {
    @Value("${jwt.header}")
    private String header;
    
    @Value("${jwt.tokenHead}")
    private String tokenHead;
    
    //  default 60 Minutes
    @Value("${jwt.oneStepMinutes}")
    private int oneStepMinutes;
    
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private static List<String> execude_path = Arrays.asList(".js",
			".css",
			".bmp",
			".jpg",
			".png",
			".gif",
			".html",
			".css.map",
			".eot",
			".svg",
			".ttf",
			".woff",
			".woff2",
			".glb",".gltf",".bin",
			"preLogin","auth/login",
			".less","getEqpStatusMaps","getEqpInfor","getOHTStatus",
			"wfmWfviewEqpt","listInprLotByEqp","listWipByEqp","listAlarmHis");
    @Autowired
    public WfmAuthenticationTokenFilter(UserDetailsService userDetailsService, JwtTokenUtil jwtTokenUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    	String authHeader = ""; // request.getHeader(header);
    	/*
		if(authHeader==null||"".equals(authHeader)) {
    		authHeader=  request.getParameter("token");
    		log.info("-----------authHeader----token-----------"+authHeader);
    	}*/
    	Boolean returnFlag = false;
		String url = request.getRequestURL().toString();
		log.debug("WfmAuthenticationTokenFilter url="+url);
		for (int i = 0; i < execude_path.size(); i++) {
			if (url.endsWith(execude_path.get(i))) {
				log.debug("static file return filter");
				returnFlag = true;
				break;
			}
		}
		if (!returnFlag) {
    	boolean isTokenExpired = false;
        HttpSession session = request.getSession(false);
        Date d0 = null;
        String sessionId = "";
        if( session != null) {
            authHeader = "" + session.getAttribute("wfm-token");
            d0 = (Date)(session.getAttribute("wfm-jwt-lastAccessTime"));
            if( d0 == null) {
                isTokenExpired = false;
            }else {
                isTokenExpired = d0.before(new Date());
                if( isTokenExpired ) {
                    log.info("wfm-jwt-lastAccessTime : {}", d0);
                    session.invalidate();
                    if( request.getCookies() != null && request.getCookies()[0] != null){
                        request.getCookies()[0].setMaxAge(0);
                    }
                    session = request.getSession();
                }
            }
            sessionId = "" + System.identityHashCode(session);
        }else {
            log.info("-----------session = null --------------");
            String authHeader2 = "" +  request.getHeader(header);
            
            if(authHeader2 == null || "".equals(authHeader2) ) {
                authHeader2 = request.getParameter("token");
            }
            log.info("-----------authHeader2----token---------[{}]", authHeader2);
            authHeader = authHeader2;
        }
        log.info("-----------session.id = [{}]----url--{}", sessionId, request.getRequestURL());
//        log.info("-----------authHeader--------{}", authHeader);
        log.info("-----------isTokenExpired----{}, wfm-jwt-lastAccessTime : {} ", isTokenExpired, d0);
        boolean isValidate = false;
        if ( authHeader != null && authHeader.startsWith(tokenHead)) {
            String authToken = authHeader.substring(tokenHead.length());
            String username = jwtTokenUtil.getUsernameFromToken(authToken);
            
            if (!isTokenExpired  && username != null
                    // && SecurityContextHolder.getContext().getAuthentication() == null
                    ) {
                UserDetails userDetails = null;
                try {
                    userDetails = userDetailsService.loadUserByUsername(username);
                } catch (Exception ex) {
                    // 残留会话引用了当前库不存在的用户：清掉坏会话，不要 500
                    log.warn("load user [{}] failed, clearing stale session: {}", username, ex.getMessage());
                    if (session != null) { try { session.invalidate(); } catch (Exception ignore) {} }
                    SecurityContextHolder.clearContext();
                }
                if (userDetails != null && jwtTokenUtil.validateToken(authToken, userDetails)) {
                    
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    isValidate = true;
                    
                    //  Extend life time 30 minutes
                    reflushAccessTime(session, username );
                    
                    log.info("-----------认证完成-----------");
                }
            }else {
                if( SecurityContextHolder.getContext().getAuthentication()  != null) {
                    isValidate = true;
                    // log.info("------------Context().getAuthentication()  != null ---------" );
                }else {
                    log.info("------------username = null -----------" );
                }
            }
            
            if( !isValidate 
                    && !request.getRequestURL().toString().contains("/auth/login") 
                    && SecurityContextHolder.getContext().getAuthentication()  == null 
                    && !isTokenExpired) {
                log.info("------------sendRedirect('../auth/login')-----------" );
                response.sendRedirect("../auth/login");
            }
        }
        log.info("-----------isValidate---------------" + isValidate);
		}
        filterChain.doFilter(request, response);
    }
    
    private void reflushAccessTime(HttpSession session, String username)
    {
        if( session != null) {
            Date d0 = new Date();
            d0 = new Date(d0.getTime() + oneStepMinutes * 60 * 1000);
            session.setAttribute("wfm-jwt-lastAccessTime", d0);
        }
        
    }
    
}
