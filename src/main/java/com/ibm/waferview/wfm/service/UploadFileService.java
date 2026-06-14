package com.ibm.waferview.wfm.service;

import java.util.List;

import com.ibm.waferview.wfm.vo.WfmFileCondition;
import com.ibm.waferview.wfm.vo.WfmFileInfo;
import com.ibm.waferview.wfm.vo.WfmFloorDef;

public interface UploadFileService
{

    List<WfmFileInfo> listFiles(WfmFileCondition fileCondition);

    /**
     * 下载文件.
     * 
     * @param md5sum
     * @return
     */
    WfmFileInfo dowloadFiles(String md5sum);

    /**
     * 设置默认的 FabView文件.
     * 
     * @param filePurpose
     * @param lastMd5sum
     * @return
     */
    String setDefaultFabViewFile(String filePurpose, String lastMd5sum);

    /**
     * 将 SVG文件设置为使用状态.
     * 
     * @param inUseFileMd5
     * @return
     */
    int setFileInUse(String inUseFileMd5,String floorNo);

    /**
     * 逻辑删除
     * 
     * @param fileCondition
     * @return
     */
    int deleteFiles(WfmFileCondition fileCondition);

    /**
     * 彻底删除 N天前逻辑删除的文件.
     * 
     * @param days:
     *            多少天以前的逻辑删除的文件.
     * @return
     */
    int deletedInvalidFiles(int days);

    /**
     * 添加 SVG文件.
     * 
     * @param fileCondition
     * @param fileContent
     * @return
     */
    int addFileInfo(WfmFileCondition fileCondition, String fileContent);

    List<WfmFloorDef> listFloorInfo();

}
