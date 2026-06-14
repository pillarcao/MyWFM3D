package com.ibm.waferview.wfm.service;

import com.ibm.waferview.wfm.vo.User;

public interface AdminService {


    User selectUserById(String userID);
}
