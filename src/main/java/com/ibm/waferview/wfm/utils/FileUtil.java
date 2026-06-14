package com.ibm.waferview.wfm.utils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;


@Component
@Slf4j
public class FileUtil {


	private FileUtil() {}
//	public static Charset SHIFT_JIS = Charset.forName("MS932");
	public static Charset UTF8 = StandardCharsets.UTF_8;
	public static String FILE_PATH = System.getProperty("user.dir")+File.separator+"wfm_file"+File.separator+"data"+File.separator;
	//public static String JSON_FILE_PATH = 
	//		ClassUtils.getDefaultClassLoader().getResource("META-INF").getPath()+"/resources/data/";


	public static boolean writeString(String fileName, String content){
		return writeString(fileName, content, UTF8);
	}

	public static boolean writeString(String fileName, String content, Charset charset){
		
		PrintWriter pw;
		try {
			log.info(FILE_PATH + fileName);
			File dir = new File(FILE_PATH);
			if(!dir.exists()) {
				if(!dir.mkdirs()){
					log.warn(FILE_PATH+" mkdirs error");
				}
			}
			File file = new File(FILE_PATH + fileName);
			pw = new PrintWriter(new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), charset)));
			pw.write(content);
			pw.flush();
			pw.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return false;
		}
		
		return true;
	}
	
	/**
	 * 
	* @Title: readFile
	* @Description: read file 
	* @param @param fileName
	* @param @param return data string
	* @param @return    设定文件
	* @return boolean    返回类型
	* @throws
	 */
	public static StringBuffer readFile(String fileName){
		File file;
		FileInputStream fis = null;
		byte[] data;
		StringBuffer sb = new StringBuffer();
		try {
			file = new File(FILE_PATH+fileName);
			fis = new FileInputStream(file);
			data = new byte[(int) file.length()];
			if(fis.read(data) !=-1 ){
				sb.append(new String(data,StandardCharsets.UTF_8));
			}
			fis.close();
//			String path = "/META-INF/resources/data/"+fileName;
//			ClassPathResource resource = new ClassPathResource(path);
//
//			BufferedReader br = new BufferedReader(new InputStreamReader(resource.getInputStream(),StandardCharsets.UTF_8));
//			String line;
//			while ((line = br.readLine()) != null) {
//				 sb.append(line + System.lineSeparator());
//			}
//			br.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if(fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return sb;
	}
	public static <T> T readFile(String fileName, Class<T> o)
	{
		File file = new File(FILE_PATH + fileName);
		byte [] content = null;
		try {
			content = Files.readAllBytes(Paths.get(file.getAbsolutePath()));
		} catch (IOException e) {
			log.error("Not Found File:" + e.getMessage());
			return null;
		}
		return JSON.parseObject(content, o);
	}
}
