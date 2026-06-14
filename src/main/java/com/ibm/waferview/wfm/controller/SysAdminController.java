package com.ibm.waferview.wfm.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ibm.waferview.wfm.vo.Menu;
import com.ibm.waferview.wfm.service.SysAdminService;

@RestController
@RequestMapping("/api")
public class SysAdminController {
	@Resource
	SysAdminService sysAdminService;
	
	@RequestMapping(value="/menus",method=RequestMethod.GET)
	public List<Menu> listMenu(HttpServletRequest request){
		List<Menu> menus =  sysAdminService.listMenu();
        HttpSession session = request.getSession(false);

        if (session != null) {
            session = request.getSession();
            session.setAttribute("wfm-menuList", menus);
        }
		
		return menus;
	}
}
