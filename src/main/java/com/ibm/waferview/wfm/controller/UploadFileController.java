package com.ibm.waferview.wfm.controller;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ibm.waferview.wfm.vo.WfmFloorDef;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.ibm.waferview.wfm.exception.CommonException;
import com.ibm.waferview.wfm.vo.WfmFileCondition;
import com.ibm.waferview.wfm.vo.WfmFileInfo;
import com.ibm.waferview.wfm.security.jwt.LoginUtils;
import com.ibm.waferview.wfm.service.UploadFileService;
import com.ibm.waferview.wfm.utils.StringUtils;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class UploadFileController extends BaseController
{
    @Autowired
    UploadFileService uploadFileService;
    

    @RequestMapping(value = "/wfm_svg_upload", method = RequestMethod.GET)
    public ModelAndView loadWfmUploadSvgView()
    {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/setting/svg_file_upload");
        return mv;
    }
   

    @RequestMapping(value = "/uploadSvgFile", method = RequestMethod.POST)
    public String uploadSvgFile(@RequestParam("file") MultipartFile file, //
             @RequestParam("filePurpose") String filePurpose,
             @RequestParam("floorNo") String floorNo,
            HttpServletRequest request)
    {
        if (file == null || file.isEmpty()) {
            throw new CommonException("wfm.upload.empty");
        }

        // 获取文件类型
        String contentType = file.getContentType();
        if (contentType == null || contentType.isEmpty() //
                || !contentType.toLowerCase().contains("svg")) {
            throw new CommonException("wfm.upload.invalid.type", "");
        }

        // 获取文件名，带扩展名
        String originFileName = file.getOriginalFilename();
        // 获取文件大小，单位字节
        long size = file.getSize();
        if (size > 20 * 1024 * 1024) {
            // 可以对文件大小进行检查
            throw new CommonException("wfm.upload.too.big");
        }

        String userId = LoginUtils.getUsername(request);

        MessageDigest m;
        StringBuilder md5sum = new StringBuilder();
        try {
            m = MessageDigest.getInstance("MD5");
            m.update(file.getBytes());
            byte[] s = m.digest();
            for (byte b : s) {
                md5sum.append(Integer.toHexString((0x000000FF & b) | 0xFFFFFF00).substring(6).toUpperCase());
            }
        } catch (NoSuchAlgorithmException | IOException e1) {
            e1.printStackTrace();
            throw new CommonException("wfm.upload.failed");
        }
        WfmFileCondition fileCondition = new WfmFileCondition();

        fileCondition.setFileMd5sum(md5sum.toString());

        List<WfmFileInfo> uploadFileInfos = uploadFileService.listFiles(fileCondition);
        if (uploadFileInfos != null && !uploadFileInfos.isEmpty()) {
            throw new CommonException("wfm.upload.file.exist", "File Name: " //
                    + uploadFileInfos.get(0).getFileName() + " \n" //
                    + "MD5: " + uploadFileInfos.get(0).getFileMd5sum());
        }

        StringBuilder sb = new StringBuilder();
        try (InputStreamReader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)) {
            while (reader.ready()) {
                // 将读取的数据转化成char类型，加入StringBuffer对象sb里
                sb.append((char) reader.read());
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new CommonException("wfm.upload.failed");
        }

        log.info("sb.length() : " + sb.length());
        String fileContent = sb.toString();
        String zipContent = StringUtils.compress(fileContent);

        fileCondition.setFileName(originFileName);
        fileCondition.setFileType(contentType);
        fileCondition.setFileSize((size >> 10) + "KB");
        fileCondition.setFilePurpose(filePurpose);
        fileCondition.setFloorNo(StringUtils.toStringAndTrim(floorNo));

        if (zipContent.length() >= fileContent.length()) {
            fileCondition.setIsZipFormat("N");
        } else {
            fileCondition.setIsZipFormat("Y");
            fileContent = zipContent;
        }

        fileCondition.setLastUser(userId);
        fileCondition.setInUse("N");
        fileCondition.setFilePurpose(filePurpose);

        uploadFileService.addFileInfo(fileCondition, fileContent);
        return "wfm.upload.success";
    }

    @RequestMapping(value = "/listFiles", method = RequestMethod.POST)
    public List<WfmFileInfo> listFiles(String filePurpose)
    {
        log.info("listSvgFiles: filePurpose = {}", filePurpose);
        WfmFileCondition fileCondition = new WfmFileCondition();
        fileCondition.setFilePurpose(filePurpose);
        fileCondition.setFileId(0);
        List<WfmFileInfo> uploadFileInfos = uploadFileService.listFiles(fileCondition);
        if (uploadFileInfos == null || uploadFileInfos.isEmpty()) {
            return new LinkedList<>();
        }

        return uploadFileInfos;
    }

    @RequestMapping(value = "/listFloorDef", method = RequestMethod.POST)
    public List<WfmFloorDef> listFloorDefine()
    {
        List<WfmFloorDef> floorDefList = uploadFileService.listFloorInfo();
        if (floorDefList == null || floorDefList.isEmpty()) {
            return new LinkedList<>();
        }
        return floorDefList;
    }
    @RequestMapping(value = "/deleteFiles", method = RequestMethod.POST)
    public String deleteFiles(HttpServletRequest request, String[] md5sumArray)
    {
        log.info("deleteFiles:");
        WfmFileCondition fileCondition = new WfmFileCondition();
        fileCondition.setMd5sumList(md5sumArray);
        String userId = LoginUtils.getUsername(request);
        fileCondition.setLastUser(userId);

        uploadFileService.deleteFiles(fileCondition);
        return "wfm.delete.success";
    }

    @RequestMapping(value = "/setFileInUse", method = RequestMethod.POST)
    public String setFileInUse(String md5sum,String floorNo)
    {
        log.info("setDefaultFabView:");
        uploadFileService.setFileInUse(md5sum,floorNo);
        return "wfm.setDefault.success";
    }

    @RequestMapping(value = "/downloadFile", method = RequestMethod.GET)
    public ResponseEntity<byte[]> downloadFile(String fileMd5sum, //
                                               HttpServletResponse response, //
            @RequestHeader("User-Agent") String userAgent) throws IOException
    {
        log.info("downloadFile:");
        WfmFileInfo fileInfo = uploadFileService.dowloadFiles(fileMd5sum);
        response.reset();
        response.setContentType("application/x-download");
        response.setCharacterEncoding("utf-8");
        response.setContentType("multipart/form-data");

        BodyBuilder builder = ResponseEntity.ok();
        // 设置内容长度
        builder.contentLength(fileInfo.getFileContent().length());
        builder.contentType(MediaType.APPLICATION_OCTET_STREAM);
        String filename = fileInfo.getFileName();

        try {
            // 对文件名进行 URL编码
            filename = URLEncoder.encode(fileInfo.getFileName(), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        if (userAgent.indexOf("MSIE") > 0) {
            builder.header("Content-Disposition", "attachment; filename=" + filename);
        } else {
            String contentDisposition = "attachment;filename=" + filename + ";filename*=UTF-8''" + filename;

            builder.header("Content-Disposition", contentDisposition);
            response.addHeader("Content-Disposition", contentDisposition);
        }

        return builder.body(fileInfo.getFileContent().getBytes());
    }


}
