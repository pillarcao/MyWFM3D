package com.ibm.waferview.wfm.security.bean;

import java.sql.Timestamp;


import lombok.Data;


@Data
public class UserRole {
    private int id;
    private String userid;
    private String roleid;
    private Timestamp version;
}
