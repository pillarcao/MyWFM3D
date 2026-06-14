package com.ibm.waferview.wfm.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ibm.waferview.wfm.vo.UserPrivilege;
import com.ibm.waferview.wfm.security.jwt.LoginUtils;
import com.ibm.waferview.wfm.security.jwt.JwtTokenUtil;
import com.ibm.waferview.wfm.security.service.AuthService;
import com.ibm.waferview.wfm.service.MonitorService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class AdminController extends BaseController
{
    @Autowired
    JwtTokenUtil jwtTokenUtil;
    @Autowired
    AuthService authService;
    @Autowired
    MonitorService monitorService;

    @RequestMapping(value = "/welcome", method = RequestMethod.GET)
    public ModelAndView loadWelcomePage(String lang, HttpServletRequest request)
    {
        log.info("load welcome page...............");

        HttpSession session = request.getSession();
        if (lang == null || lang.trim().length() == 0) {
            lang = "zh_CN";
        }
        session.setAttribute("wfm-language", lang); // save lang to session

        return page("welcome");
    }

   
    @RequestMapping(value = "/getUserPrivilege", method = RequestMethod.GET)
    public List<UserPrivilege> getUserPrivilege(String token)
    {
        String userName = jwtTokenUtil.getUsernameFromToken(token.substring(7));
        return authService.getUserPrivilege(userName);
    }
    
    @RequestMapping(value="/getuserprivilegebyuserid",method=RequestMethod.POST)
	public List<UserPrivilege> getUserPrivilegeById(HttpServletRequest request) {
		String userId = LoginUtils.getUsername(request);
		return authService.getUserPrivilege(userId);
	}

}
