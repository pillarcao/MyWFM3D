package com.ibm.waferview.wfm.security.bean;


import java.sql.Timestamp;

import lombok.Data;


@Data
public class Role {
    private int roleid;
    private String rolename;
    private Timestamp version;
}
