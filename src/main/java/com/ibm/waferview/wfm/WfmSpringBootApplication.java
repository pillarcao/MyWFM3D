package com.ibm.waferview.wfm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.DispatcherServlet;

@SpringBootApplication
public class WfmSpringBootApplication {
	 public static void main(String[] args) {
		 SpringApplication.run(WfmSpringBootApplication.class, args);
	 }
	 @Bean
	 public ServletRegistrationBean<DispatcherServlet> dispatcherRegistration(DispatcherServlet dispatcherServlet) {
		ServletRegistrationBean<DispatcherServlet> reg = new ServletRegistrationBean<>(dispatcherServlet);
		reg.getUrlMappings().clear();
		reg.addUrlMappings("/service/*");
		return reg;
	 }
}
