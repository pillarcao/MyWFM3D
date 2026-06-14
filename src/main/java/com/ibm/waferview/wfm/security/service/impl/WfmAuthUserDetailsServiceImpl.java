package com.ibm.waferview.wfm.security.service.impl;



import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ibm.waferview.wfm.dao.AdminMapper;
import com.ibm.waferview.wfm.vo.User;
import com.ibm.waferview.wfm.security.bean.JWTUser;
import com.ibm.waferview.wfm.security.bean.Role;

import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
public class WfmAuthUserDetailsServiceImpl implements  UserDetailsService {
    
	@Resource
	private AdminMapper adminMapper;
	
	private String decodeMMPasswd(String password) {

		char[] ps = password.toCharArray();
		StringBuilder sb = new StringBuilder();
		char a;
		for(int i = ps.length-1;i>=0;i--) {
			byte b = (byte)ps[i];
			b--;
			a = (char)b;
			sb.append(a);
		}
		
		// return sb.toString();
		return password.trim();
	}
	       
	  
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    	log.info("------------WfmAuthUserDetailsServiceImpl,username-------------------"+username);
    	JWTUser user =new JWTUser();
    	if(username!="NONE_PROVIDED"&&username!=null) {
    		
    	User sysUser=adminMapper.selectUserById(username);
        user.setUserName(sysUser.getUserId());
        user.setUserPwd(new BCryptPasswordEncoder().encode(decodeMMPasswd(sysUser.getPasswd())));
        //user.setUserPwd(sysUser.getPasswd());
       
        List<Role> roles=new ArrayList<>();
        Role r=new Role();
        r.setRoleid(1);
        if("".equals(sysUser.getDepartment())){
            r.setRolename("Department not set");
		}else{
			r.setRolename(sysUser.getDepartment());
		}
        roles.add(r);
        user.setRoles(roles);
    	}
        return user;
    }
}
