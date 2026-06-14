package com.ibm.waferview.wfm.security.bean;

import lombok.Data;


@Data
public class ResultVo {
    private int code;
    private String msg;
    private Object data;
    private String token;


    public ResultVo(int code, String msg, Object data, String token) {
        this.code = code;
        this.msg = msg;
        this.data = data;
        this.token = token;
    }

    public ResultVo(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public ResultVo(int code, String msg, String token) {
        this.code = code;
        this.msg = msg;
        this.token = token;
    }
}
