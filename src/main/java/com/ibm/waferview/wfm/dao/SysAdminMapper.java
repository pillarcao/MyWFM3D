package com.ibm.waferview.wfm.dao;

import java.util.List;

import com.ibm.waferview.wfm.vo.Menu;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SysAdminMapper {
	List<Menu> listMenu();
}
