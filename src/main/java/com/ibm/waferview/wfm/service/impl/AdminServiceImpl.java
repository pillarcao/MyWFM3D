package com.ibm.waferview.wfm.service.impl;

import javax.annotation.Resource;

import com.ibm.waferview.wfm.vo.User;
import org.springframework.stereotype.Service;

import com.ibm.waferview.wfm.dao.AdminMapper;
import com.ibm.waferview.wfm.service.AdminService;

@Service("adminService")
//@Slf4j
public class AdminServiceImpl implements AdminService
{
    @Resource
    AdminMapper adminMapper;

    @Override
    public User selectUserById(String userID) {
        return adminMapper.selectUserById(userID);
    }
}
