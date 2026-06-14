/**
 * Copyright 2018-2025 CMCC.
 */
package com.ibm.waferview.wfm.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;
import org.apache.commons.codec.binary.Base64;

/**
 * @Author zhuxiuhong
 * @Since 2020年11月17日 上午8:17:31
 */
public class StringUtils
{

    public static String compress(String str) {
        if (str == null || str.length() == 0) {
            return str;
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        GZIPOutputStream gzip = null;
        try {
            gzip = new GZIPOutputStream(out);
            gzip.write(str.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (gzip != null) {
                try {
                    gzip.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
//        return new sun.misc.BASE64Encoder().encode(out.toByteArray());
        return new String(Base64.encodeBase64(out.toByteArray()));
    }
     
    /**
     * 使用gzip解压缩
     * @param compressedStr 压缩字符串
     * @return
     */
    public static String uncompress(String compressedStr) {
        if (compressedStr == null) {
            return null;
        }
     
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayInputStream in = null;
        GZIPInputStream ginzip = null;
        byte[] compressed;
        String decompressed = null;
        try {
//            compressed = new sun.misc.BASE64Decoder().decodeBuffer(compressedStr);
            compressed =  Base64.decodeBase64(compressedStr);
            in = new ByteArrayInputStream(compressed);
            ginzip = new GZIPInputStream(in);
            byte[] buffer = new byte[1024];
            int offset = -1;
            while ((offset = ginzip.read(buffer)) != -1) {
                out.write(buffer, 0, offset);
            }
            decompressed = out.toString();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (ginzip != null) {
                try {
                    ginzip.close();
                } catch (IOException e) {
                }
            }
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                }
            }
        }
        return decompressed;
    }
    public static String toStringAndTrim(Object o) {
        try {
            return o == null ? "" : String.valueOf(o).trim();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "";
    }
    public static boolean isMatch(final Object o1,final Object o2) {
        try {
            if( o1 == null ||  o2 == null ) {
                return false;
            }
            return toStringAndTrim(o1).equals(toStringAndTrim(o2));
        }
        catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }
    public static boolean isEmpty(Object s){
        try {
            return s == null || s.toString().trim().length() == 0;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    public static int parseInt(Object o) {
        int rtnVal = 0;
        try {
            if (o == null || toStringAndTrim(o).length() == 0)
                return rtnVal;
            try {
                rtnVal = Integer.parseInt(toStringAndTrim(o));
            } catch (NumberFormatException ex) {
                try {
                    rtnVal = (int) Math.floor(Double.parseDouble(toStringAndTrim(o)));
                } catch (NumberFormatException dEx) {
                    dEx.printStackTrace();
                }
            }
        } catch (Exception $exception$) {
            $exception$.printStackTrace();
        }
        return rtnVal;
    }
//    public static String getMd5sum( MultipartFile file) {
//        return "";
//                
//    }

}
