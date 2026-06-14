package com.ibm.waferview.wfm.security.service;

import com.ibm.waferview.wfm.vo.UserPrivilege;
import java.util.List;

public interface AuthService {
    //User register(User user);
    String login(String username, String password);
    String refresh(String oldToken);
    //List  queryUser();
    List<UserPrivilege> getUserPrivilege(String username);
}
