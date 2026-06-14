package com.ibm.waferview.wfm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

//import com.ibm.waferview.wfm.model.admin.GroupDef;
//import com.ibm.waferview.wfm.model.admin.GroupUserDef;
import com.ibm.waferview.wfm.vo.User;
import com.ibm.waferview.wfm.vo.UserPrivilege;
@Mapper
public interface AdminMapper {
	//User
    List<User> listUser(User user);
    /**
     * @param userIds
     * @return
     */
    List<User> listUserByIds(@Param("userIds")String[] userIds);
    
    User selectUserById(String userId);
    List<UserPrivilege> getUserPrivilege(@Param("USERID")String USERID);
    

}
