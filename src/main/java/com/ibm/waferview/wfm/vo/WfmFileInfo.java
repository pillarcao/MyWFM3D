/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * @Author zhuxiuhong
 * @Since 2020年11月12日 上午9:17:19
 */
 @Data
public class WfmFileInfo implements Serializable
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    private String fileMd5sum         ; // md5 ;
    private Integer fileId             ; // 文件序号;
    private String fileName           ; // 原始文件名 
    private String fileSize           ; 
    private String fileType           ; // 文件类型
    private String inUse              ; // 是否在使用. 
    private String filePurpose        ; // 文件用途.
    private String isZipFormat        ; // 内容是否为zip压缩格式. 
    private String fileContent        ; // 压缩后的文件内容. 
    private String floorNo;            //楼层号
    private String floorName;          //楼层名称;
    private String lastUser;
    private String lastDatetime;
}
