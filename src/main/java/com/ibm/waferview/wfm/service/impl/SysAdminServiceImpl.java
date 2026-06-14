package com.ibm.waferview.wfm.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.ibm.waferview.wfm.dao.SysAdminMapper;
import com.ibm.waferview.wfm.vo.Menu;
import com.ibm.waferview.wfm.service.SysAdminService;

@Service("sysAdminService")
public class SysAdminServiceImpl implements SysAdminService{
	@Resource
	SysAdminMapper sysAdminMapper;

	@Override
	public List<Menu> listMenu() {
		return sysAdminMapper.listMenu();
	}

}
