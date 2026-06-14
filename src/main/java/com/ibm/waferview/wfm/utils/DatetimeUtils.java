package com.ibm.waferview.wfm.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DatetimeUtils {
	public static int minitesBetween(String dateTime1,String dateTime2) throws ParseException {
		if(dateTime1.length() > 23) {
			dateTime1 = dateTime1.substring(0, 23);
		}
		if(dateTime2.length() > 23) {
			dateTime2 = dateTime2.substring(0, 23);
		}
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
		Date date1 = df.parse(dateTime1);
		Date date2 = df.parse(dateTime2);
		long time1 = date1.getTime();
		long time2 = date2.getTime();
		float minBetween = (float)(time2-time1)/(1000*60);
		return Math.abs(Math.round(minBetween));
	}
	
	public static boolean greaterThan(String dateTime1,String dateTime2)  throws ParseException {
		if(dateTime1.length() > 23) {
			dateTime1 = dateTime1.substring(0, 23);
		}
		if(dateTime2.length() > 23) {
			dateTime2 = dateTime2.substring(0, 23);
		}
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
		Date date1 = df.parse(dateTime1);
		Date date2 = df.parse(dateTime2);
		long time1 = date1.getTime();
		long time2 = date2.getTime();
		return time1 > time2;
	}
	
//	public static void main(String[] args) throws ParseException {
//		System.out.println(greaterThan("2019-11-21 10:31:26.770223","2019-11-21 10:30:57.981313"));
//	}
//	
}
