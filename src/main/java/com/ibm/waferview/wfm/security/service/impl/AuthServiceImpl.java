package com.ibm.waferview.wfm.security.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.ibm.waferview.wfm.dao.AdminMapper;
import com.ibm.waferview.wfm.vo.UserPrivilege;
import com.ibm.waferview.wfm.security.jwt.JwtTokenUtil;
import com.ibm.waferview.wfm.security.service.AuthService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private AuthenticationManager authenticationManager;
    private UserDetailsService userDetailsService;
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    AdminMapper adminMapper;
    //private UserMapper userMapper;


    @Autowired
    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtTokenUtil jwtTokenUtil) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

   

    @Override
    public String login(String username, String password) {
        log.info("------------login------------{}", username);
        UsernamePasswordAuthenticationToken upToken = new UsernamePasswordAuthenticationToken(username, password);
        Authentication authentication = authenticationManager.authenticate(upToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtTokenUtil.generateToken(userDetails);
        return token;
    }

    @Override
    public String refresh(String oldToken) {
        String token = oldToken.substring("Bearer".length());
        String username = jwtTokenUtil.getUsernameFromToken(token);
        //JWTUser user = (JWTUser) userDetailsService.loadUserByUsername(username);
        if (!jwtTokenUtil.isTokenExpired(token)) {
            return jwtTokenUtil.refreshToken(token);
        }
        return null;
    }

    @Override
    public List<UserPrivilege> getUserPrivilege(String username) {
        List<UserPrivilege> userPrivilegeList = adminMapper.getUserPrivilege(username);
        return userPrivilegeList;
    }
	
   
}
