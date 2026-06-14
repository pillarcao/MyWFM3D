package com.ibm.waferview.wfm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibm.waferview.wfm.vo.WfmFileCondition;
import com.ibm.waferview.wfm.vo.WfmFileInfo;
@Mapper
public interface WfmFileDefMapper
{
    /**
     * 列出符合条件的文件信息列表.( 不包含文件内容 fileContent ) 
     * @param fileCondition
     * @return
     */
    List<WfmFileInfo> listFileInfo(WfmFileCondition fileCondition);
    
    /**
     * 下载文件.(包含文件内容fileContent) 
     * @param md5sum
     * @return
     */
    List<WfmFileInfo> dowloadFile(@Param("md5sum") String md5sum);
    
    int setFileInUse(WfmFileCondition fileCondition );
    /**
     * 逻辑删除 
     * @param fileCondition
     * @return
     */
    int deleteFiles(WfmFileCondition fileCondition);
    
    /**
     * 跟据md5值, 直接删除这个文件. 
     * @param fileCondition
     * @return
     */
    int hardDeletedFile(WfmFileCondition fileCondition);
    int addFileInfo(WfmFileCondition fileCondition);
    
}
