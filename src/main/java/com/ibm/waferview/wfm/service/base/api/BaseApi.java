/**
 * Copyright 2018-2025 IBM.
 */
package com.ibm.waferview.wfm.service.base.api;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.ibm.waferview.wfm.exception.BaseException;

/**
 * 处理通用异常
 * 
 * @author zhuxiuhong
 * @since 2018
 */
public class BaseApi <T extends Serializable>{
  private static final Logger logger = LoggerFactory.getLogger(BaseApi.class);


  /**
   * 用于处理通用异常
   */
  @ExceptionHandler
  @ResponseBody
  @ResponseStatus(code = HttpStatus.OK)
  protected Object exception(Exception exception, HttpServletRequest request,
      HttpServletResponse response) {
    logger.warn("got a Exception", exception);
    String message = "";
    Object result;

    if (exception instanceof BaseException) {
      BaseException baseException = (BaseException) exception;
      
      Map<String, String> returnMap = new HashMap<>();
      returnMap.put("errorCode", baseException.getCode());
      returnMap.put("data", baseException.getMessage() );
      
      result = returnMap;
      response.setStatus(HttpStatus.OK.value());
      
    } else {
      logger.error(exception.getMessage(), exception);
      message = message + " INTERNAL_SERVER_ERROR！" + exception.getMessage();
      result = message;
    }
    
    response.setHeader("Cache-Control", "no-cache");   
    response.setContentType("text/json;charset=UTF-8");  
    response.setCharacterEncoding("UTF-8");  

    response.setStatus(HttpStatus.OK.value());
    return result;
  }
  
  
  public String trimObject (Object entity) {
      if(entity == null) {
          return null;
      }
      Class<?> type = entity.getClass();
      if(type.isPrimitive()) {
          return null;
      }
      if(type.equals(String.class)) {
          return ((String)entity).trim();
      }
      
      Field[] fields = type.getDeclaredFields();
      for (Field f : fields) {
          boolean isAccessible = f.isAccessible();
          if (!isAccessible) {
              f.setAccessible(true);
          }
          try {
              /*
                目标
               */
              Object val_target = f.get(entity);
              
              if(val_target!= null && val_target.getClass().equals(String.class)) {
                  f.set(entity, ((String)val_target).trim());
              }

          } catch (IllegalArgumentException | IllegalAccessException e) {
              logger.info("trim时发生了错误. fieldName:{},  ErrorMsg: {} ", f.getName(), e.getMessage());
          }
      }
      
      return null;
  }
  
  

}
