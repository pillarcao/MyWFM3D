/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.utils;

import java.lang.reflect.Field;

/**
 * @Author zhuxiuhong
 * @Since 2020年8月13日 下午4:26:12
 */
public class ObjectUtils
{
    
    static public String trimObject (Object entity) {
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
            Boolean isAccessible = f.isAccessible();
            if (!isAccessible) {
                f.setAccessible(true);
            }
            try {
                /**
                 * 目标
                 */
                Object val_target = f.get(entity);
                
                if(val_target!= null && val_target.getClass().equals(String.class)) {
                    f.set(entity, ((String)val_target).trim());
                }

            } catch (IllegalArgumentException | IllegalAccessException e) {
                // logger.info("trim时发生了错误. fieldName:{},  ErrorMsg: {} ", f.getName(), e.getMessage());
            }
        }
        
        return null;
    }

}
