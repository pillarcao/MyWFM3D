package com.ibm.waferview.wfm.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.ibm.waferview.wfm.service.AdminService;
import com.ibm.waferview.wfm.vo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ibm.waferview.wfm.vo.UserPrivilege;
import com.ibm.waferview.wfm.security.jwt.JwtTokenUtil;
import com.ibm.waferview.wfm.security.service.AuthService;
import com.ibm.waferview.wfm.service.SysAdminService;

import lombok.extern.slf4j.Slf4j;

@SuppressWarnings("ALL")
@RestController
@RequestMapping("/auth")
@Slf4j
public class LoginController extends BaseController
{
    @Resource
    SysAdminService sysAdminService;

    @Resource
    AdminService adminService;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @Autowired
    AuthService authService;

    @Value("${jwt.tokenHead}")
    String tokenHead;
    
    @Value("${jwt.oneStepMinutes}")
    int oneStepMinutes;
    
    @Value("${jwt.expiration}")
    int tokenExpiration;

    @RequestMapping(value = "/preLogin", method = RequestMethod.GET)
    public ModelAndView preLogin()
    {
        return page("login");
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ModelAndView Login()
    {
        return page("login");
    }

    @RequestMapping(value = "/getUserInfo", method = RequestMethod.GET)
    public User getUser(String userid)
    {
        return adminService.selectUserById(userid);
    }
    @RequestMapping(value = "/token", method = RequestMethod.POST)
    public String getToken(String username, String password, HttpServletRequest request, HttpServletResponse response)
    {
        log.info("===============token api start======================");
        String token = ""; 
        try {
            token = authService.login(username, password);
        } catch (Exception e) {
            log.info("=======authService.login happen Exception:[{}] ====", e.getMessage());
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
                if( request.getCookies() != null && request.getCookies()[0] != null){
                    request.getCookies()[0].setMaxAge(0);
                }
            }
         //   throw e;
            return "10101";
        }
        log.info("===============token api end  ======================" + token);

        HttpSession session = request.getSession(false);

        if (session != null) {
            // Regenerate new session,   // zhuxiuhong 2020/07/30 06:24 
            session.invalidate();
            if( request.getCookies() != null && request.getCookies()[0] != null){
                request.getCookies()[0].setMaxAge(0);
            }
            session = request.getSession();
            
            // session Maximum life cycle:          // zhuxiuhong 2020/07/29 21:24 
            session.setMaxInactiveInterval( tokenExpiration * 60 );
            session.setAttribute("wfm-token", tokenHead + " " + token);
            session.setAttribute("wfm-current-userId", username);
            // save token left time to request.session    // zhuxiuhong 2020/07/27
            Date d0 = new Date();
            d0 = new Date(d0.getTime() + (long) oneStepMinutes * 60 * 1000);
            session.setAttribute("wfm-jwt-lastAccessTime", d0);

            // getUserPrivilege
            String userName = jwtTokenUtil.getUsernameFromToken(token);
            List<UserPrivilege> userPrivilegeList = authService.getUserPrivilege(userName);
            List<String> amsUserPrivilege = new ArrayList<>();
            for (UserPrivilege privilege : userPrivilegeList) {
                if (privilege != null && privilege.getFunctionId() != null
                        && !privilege.getFunctionId().trim().isEmpty()) {
                    amsUserPrivilege.add(privilege.getFunctionId());
                }
            }

            session.setAttribute("wfm-userPrivilege", amsUserPrivilege);
            //  session.setAttribute("wfm-menu", sysAdminService.listMenu());
        }

        return token;
    }

}
