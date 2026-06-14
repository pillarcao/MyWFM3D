package com.ibm.waferview.wfm.service.impl;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;

import com.ibm.waferview.wfm.dao.WfmFloorDefMapper;
import com.ibm.waferview.wfm.vo.WfmFloorDef;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ibm.waferview.wfm.dao.WfmFileDefMapper;
import com.ibm.waferview.wfm.exception.CommonException;
import com.ibm.waferview.wfm.vo.WfmFileCondition;
import com.ibm.waferview.wfm.vo.WfmFileInfo;
import com.ibm.waferview.wfm.service.UploadFileService;
import com.ibm.waferview.wfm.utils.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Service("uploadFileService")
@Slf4j
public class UploadFileServiceImpl implements UploadFileService
{
    @Resource
    WfmFileDefMapper fileDefMapper;

    @Resource
    WfmFloorDefMapper floorDefMapper;
    
    public static String SVG_PATH = System.getProperty("user.dir")+File.separator+"wfm_file"+File.separator+"svg"+File.separator;
    public static final int MAX_CONTENT_BYTE = 4500; // max: 5000;
//    @Resource
//    @Lazy
//    private RedisUtil redisUtil;

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月13日 上午8:26:58
     * @see com.ibm.waferview.wfm.service.UploadFileService#listUploadFiles(com.ibm.waferview.wfm.model.sysadmin.UploadFileInfo)
     */
    @Override
    public List<WfmFileInfo> listFiles(WfmFileCondition fileCondition)
    {
        return fileDefMapper.listFileInfo(fileCondition);
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月17日 下午2:29:13
     * @see com.ibm.waferview.wfm.service.UploadFileService#dowloadFiles(java.lang.String)
     */
    @Override
    public WfmFileInfo dowloadFiles(String md5sum)
    {
        log.info("=== dowloadFiles == md5sum: {}", md5sum);
        List<WfmFileInfo> list = fileDefMapper.dowloadFile(md5sum);
        if (list == null || list.isEmpty()) {
            throw new CommonException("wfm.file.not.exist");
        }
        StringBuilder fileContent = new StringBuilder();
        for (WfmFileInfo f : list) {
            fileContent.append(f.getFileContent());
        }
        if (fileContent.length() < 10) {
            throw new CommonException("wfm.invalid.file");
        }

        if (list.get(0).getIsZipFormat().equals("Y")) {
            fileContent = new StringBuilder(StringUtils.uncompress(fileContent.toString()));
        }
        
        list.get(0).setFileContent(fileContent.toString());

        return list.get(0);
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月17日 下午2:29:13
     * @see com.ibm.waferview.wfm.service.UploadFileService#setFileInUse(java.lang.String, java.lang.String[])
     */
    @Override
    @Transactional
    public int setFileInUse(String inUseFileMd5,String floorNo)
    {
        WfmFileCondition fileCondition = new WfmFileCondition();
        fileCondition.setFileMd5sum(inUseFileMd5);
        
        List<WfmFileInfo> list = fileDefMapper.listFileInfo(fileCondition);
        if(list == null || list.isEmpty()) {
            throw new CommonException("wfm.file.not.exist");
        }
        
        if( list.get(0).getFilePurpose() == null && list.get(0).getFilePurpose().isEmpty()) {
            throw new CommonException("wfm.file.purpose.invalid");
        }
        
        fileCondition.setFileMd5sum(null);
        fileCondition.setFilePurpose(list.get(0).getFilePurpose());
        fileCondition.setInUse("Y");
        fileCondition.setFloorNo(floorNo);
        list = fileDefMapper.listFileInfo(fileCondition);
        if( list != null && !list.isEmpty()) {
            String[] md5sumList = new String[list.size()];
            int i = 0;
            for(WfmFileInfo f: list) {
                md5sumList[i ++ ] = f.getFileMd5sum();
            }
            
            fileCondition.setMd5sumList(md5sumList);
            fileCondition.setInUse("N");
            
            fileDefMapper.setFileInUse(fileCondition);
        }
        
        fileCondition.setMd5sumList(null);
        fileCondition.setInUse("Y");
        fileCondition.setFileMd5sum(inUseFileMd5);
        fileDefMapper.setFileInUse(fileCondition);
        
        replaceTargetFile(dowloadFiles(inUseFileMd5));
        
        return 1;
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月17日 下午2:29:13
     * @see com.ibm.waferview.wfm.service.UploadFileService#deleteFiles(java.lang.String[])
     */
    @Override
    @Transactional
    public int deleteFiles(WfmFileCondition fileCondition)
    {

        List<WfmFileInfo> list = fileDefMapper.listFileInfo(fileCondition);
        for (WfmFileInfo f : list) {
            if (f.getInUse().equals("Y")) {
                throw new CommonException("wfm.delete.inuse.file");
            }
        }

        return fileDefMapper.deleteFiles(fileCondition);
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月17日 下午2:29:13
     * @see com.ibm.waferview.wfm.service.UploadFileService#clearDeletedFiles(int)
     */
    @Override
    @Transactional
    public int deletedInvalidFiles(int days)
    {
        log.info("=== clearDeletedFiles ==");
        WfmFileCondition fileCondition = new WfmFileCondition();
        fileCondition.setInvalidDays(days);
        
        return fileDefMapper.hardDeletedFile(fileCondition);
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月17日 下午2:29:13
     * @see com.ibm.waferview.wfm.service.UploadFileService#addFileInfo(com.ibm.waferview.wfm.model.sysadmin.UploadFileInfo)
     */
    @Override
    @Transactional
    public int addFileInfo(WfmFileCondition fileCondition, String fileContent)
    {
        log.info("=== addFileInfo ==");
        fileDefMapper.hardDeletedFile(fileCondition);

        int length = fileContent.length();
        int cnt = length / MAX_CONTENT_BYTE;
        if( length >  cnt * MAX_CONTENT_BYTE ) {
            cnt += 1;
        }
        
        String[] fileContents = new String[ cnt ];
        
        int start = 0;
        int i = 0;
        while (true) {
            int end = Math.min((start + MAX_CONTENT_BYTE), length);
            fileContents[i] = fileContent.substring(start, end);
            
            if (end == length) {
                break;
            }
            
            start += MAX_CONTENT_BYTE;
            ++i;
        }
        
        fileCondition.setFileContents(fileContents);
        // fileCondition.setFileContent(fileContents[0]);

        fileDefMapper.addFileInfo(fileCondition);
        return 1;
    }

    @Override
    public List<WfmFloorDef> listFloorInfo() {
        return floorDefMapper.listFloorInfo();
    }

    /*  
     * @Author zhuxiuhong
     * @Since 2020年11月17日 下午2:57:15
     * @see com.ibm.waferview.wfm.service.UploadFileService#setDefaultFabView()
     */
    @Override
    public String setDefaultFabViewFile( String filePurpose, String lastMd5sum)
    {
//        log.info("====== setDefaultFabView =====  lastMd5sum = {}", lastMd5sum);
        WfmFileCondition fileCondition = new WfmFileCondition();

        fileCondition.setFilePurpose(filePurpose);
        fileCondition.setInUse("Y");

        List<WfmFileInfo> list = fileDefMapper.listFileInfo(fileCondition);
        if (list.isEmpty()) {
            log.info("====== can't Find inUse Svg File, use the first FabView.svg ===== ");
            fileCondition.setInUse(null);
            list = fileDefMapper.listFileInfo(fileCondition);
        }
        if (list.isEmpty()) {
            throw new CommonException("wfm.file.not.exist");
        }
        
//        log.info("list.get(0).getFileMd5sum() =  {}", list.get(0).getFileMd5sum());
        
        if(!lastMd5sum.equals(list.get(0).getFileMd5sum())) {
            return replaceTargetFile(dowloadFiles(list.get(0).getFileMd5sum()));
        }
        
        return lastMd5sum;
    }
    
    private String replaceTargetFile( WfmFileInfo fileInfo)
    {   
    	File dirFile = new File(SVG_PATH + fileInfo.getFloorNo() + File.separator);
		if(!dirFile.exists()) {
			if(!dirFile.mkdirs()){
                log.warn(SVG_PATH+" mkdirs error");
            }
		}
		String targetPath = SVG_PATH + fileInfo.getFloorNo() + File.separator + "FabView.jsp";
//        String resourcePath = ClassUtils.getDefaultClassLoader().getResource("META-INF").getPath();
//        String targetPath = resourcePath + "/resources/WEB-INF/jsp/svg/FabView.jsp";
        
        String fileContent = fileInfo.getFileContent();
        log.info("replaceTargetFile: TargetPath: {}", targetPath);
        // 创建文件对象
        File fileText = new File(targetPath);

        // 向文件写入对象写入信息
        try (FileWriter fileWriter = new FileWriter(fileText)) {
            // 写文件
            fileWriter.write(fileContent);
            // 关闭
            fileWriter.close();
            
            log.info("replaceTargetFile: return: {}", fileInfo.getFileMd5sum());
//            redisUtil.set("current_svgFile_FabView_md5", fileInfo.getFileMd5sum(), 30*60 );
            return fileInfo.getFileMd5sum();
            
        } catch (IOException e) {
            e.printStackTrace();
            throw new CommonException("wfm.set.default.fabview.failed");
        }
    }

}
