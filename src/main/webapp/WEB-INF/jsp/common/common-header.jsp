<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<!DOCTYPE html>
<%
    String  baseUrl = request.getScheme()+"://"
                        +request.getServerName()+":"
                        +request.getServerPort()
                        +request.getContextPath()+"/service/";
	String requestURL = request.getRequestURL().toString();
	String language   = "";
	if( request.getSession(false) != null){
      if( session.getAttribute("wfm-token") != null){
	      language = session.getAttribute("wfm-language") +"";
	  }
	}
%>
<html>
<head>
	<base href="<%=baseUrl %>">
	<meta charset="utf-8">
  	<meta http-equiv="X-UA-Compatible" content="IE=edge">
  	<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  	<link rel="stylesheet" href="<%=baseUrl %>adminLTE/bower_components/bootstrap/dist/css/bootstrap.min.css">
  	<!-- Font Awesome -->
 	<link rel="stylesheet" href="<%=baseUrl %>adminLTE/bower_components/font-awesome/css/font-awesome.min.css">
  	<!-- Ionicons -->
  	<link rel="stylesheet" href="<%=baseUrl %>adminLTE/bower_components/Ionicons/css/ionicons.min.css">
  	<!-- iCheck for checkboxes and radio inputs -->
  	<link rel="stylesheet" href="<%=baseUrl %>adminLTE/plugins/iCheck/all.css">
  	<!-- Theme style -->
  	<link rel="stylesheet" href="<%=baseUrl %>adminLTE/dist/css/AdminLTE.min.css">
  	<link rel="stylesheet" href="<%=baseUrl %>adminLTE/dist/css/skins/_all-skins.min.css">
  	<link rel="stylesheet" href="<%=baseUrl %>adminLTE/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css"> 
  	<!-- bootstrap validator -->
  	<link rel="stylesheet" href="<%=baseUrl %>bootstrap-validator/dist/css/bootstrapValidator.min.css">
  	<!-- bootstrap duallistbox -->
  	<link rel="stylesheet" href="<%=baseUrl %>bootstrap-duallistbox/bootstrap-duallistbox.min.css">
  	<!-- Select2 -->
  	<link rel="stylesheet" href="<%=baseUrl %>adminLTE/bower_components/select2/dist/css/select2.min.css">
	
	<style>
		.displayNone{
			display: none;
		}
		.checkboxFixedWidth{
			width: 8px !important;
		}
	</style> 
	  
	<script type="text/javascript">
		sessionStorage.setItem("wfm_language", "<%=language %>" );
		<%  try {      
			if( !requestURL.contains("jsp/login")  
	 			&& !requestURL.contains("service/auth/token") 
	 			&& !requestURL.contains("service/auth/login") 
	 			// && !requestURL.contains("jsp/welcome") 
	 			&& !requestURL.endsWith("/wfm-component-client/") ){  %>  ;  
					
		msg_confirm_update = '<spring:message code="wfm.confirm.update"/>';
		msg_confirm_delete = '<spring:message code="wfm.confirm.delete"/>';
		
		
		sessionStorage.setItem("wfm.confirm.logout"               ,  '<spring:message code="wfm.confirm.logout"               />');


		sessionStorage.setItem("wfm.upload.empty"               ,  '<spring:message code="wfm.upload.empty"               />');
		sessionStorage.setItem("wfm.upload.invalid.type"        ,  '<spring:message code="wfm.upload.invalid.type"        />');
		sessionStorage.setItem("wfm.upload.filename.long"       ,  '<spring:message code="wfm.upload.filename.long"       />');
		sessionStorage.setItem("wfm.upload.failed"              ,  '<spring:message code="wfm.upload.failed"              />');
		sessionStorage.setItem("wfm.upload.save.failed"         ,  '<spring:message code="wfm.upload.save.failed"         />');
		sessionStorage.setItem("wfm.upload.success"             ,  '<spring:message code="wfm.upload.success"             />');
		sessionStorage.setItem("wfm.upload.file.exist"          ,  '<spring:message code="wfm.upload.file.exist"          />');
		sessionStorage.setItem("wfm.upload.too.big"             ,  '<spring:message code="wfm.upload.too.big"             />');
		sessionStorage.setItem("wfm.file.not.exist"             ,  '<spring:message code="wfm.file.not.exist"             />');
		sessionStorage.setItem("wfm.invalid.file"               ,  '<spring:message code="wfm.invalid.file"               />');
		sessionStorage.setItem("wfm.file.purpose.invalid"       ,  '<spring:message code="wfm.file.purpose.invalid"       />');
		sessionStorage.setItem("wfm.delete.inuse.file"          ,  '<spring:message code="wfm.delete.inuse.file"          />');
		sessionStorage.setItem("wfm.set.default.fabview.failed" ,  '<spring:message code="wfm.set.default.fabview.failed" />');
		sessionStorage.setItem("wfm.delete.none.select.file"    ,  '<spring:message code="wfm.delete.none.select.file"    />');
		sessionStorage.setItem("wfm.confirm.select.one"         ,  '<spring:message code="wfm.confirm.select.one"         />');
		sessionStorage.setItem("wfm.confirm.select.none"        ,  '<spring:message code="wfm.confirm.select.none"        />');
		sessionStorage.setItem("wfm.confirm.delete"             ,  '<spring:message code="wfm.confirm.delete"             />');
		sessionStorage.setItem("wfm.confirm.setDefault"         ,  '<spring:message code="wfm.confirm.setDefault"         />');
		sessionStorage.setItem("wfm.delete.success"             ,  '<spring:message code="wfm.delete.success"             />');
		sessionStorage.setItem("wfm.setDefault.success"         ,  '<spring:message code="wfm.setDefault.success"         />');

		sessionStorage.setItem("wfm.confirm.update"        ,  '<spring:message code="wfm.confirm.update"        />');
		sessionStorage.setItem("wfm.confirm.delete"        ,  '<spring:message code="wfm.confirm.delete"        />');
		sessionStorage.setItem("wfm.confirm.logout"        ,  '<spring:message code="wfm.confirm.logout"        />');
		sessionStorage.setItem("wfm.incorrect.input"       ,  '<spring:message code="wfm.incorrect.input"       />');
		sessionStorage.setItem("wfm.update.succeeded"      ,  '<spring:message code="wfm.update.succeeded"      />');
		sessionStorage.setItem("wfm.wfm.no.eqpId"          ,  '<spring:message code="wfm.no.eqpId"              />');
		sessionStorage.setItem("wfm.refresh"               ,  '<spring:message code="wfm.refresh"               />');
		
		sessionStorage.setItem("wfm.menu.WELCOME"          ,  '<spring:message code="wfm.menu.WELCOME"          />');
		sessionStorage.setItem("wfm.menu.COLOR_DEF"        ,  '<spring:message code="wfm.menu.COLOR_DEF"        />');
		sessionStorage.setItem("wfm.menu.SVG_UPLOAD"       ,  '<spring:message code="wfm.menu.SVG_UPLOAD"       />');
		sessionStorage.setItem("wfm.menu.MONITOR"          ,  '<spring:message code="wfm.menu.MONITOR"          />');
		
		sessionStorage.setItem("wfm.contextmenu.eqpId"     ,  '<spring:message code="wfm.contextmenu.eqpId"     />');
		sessionStorage.setItem("wfm.contextmenu.status"    ,  '<spring:message code="wfm.contextmenu.status"    />');
		sessionStorage.setItem("wfm.contextmenu.mode"      ,  '<spring:message code="wfm.contextmenu.mode"      />');
        sessionStorage.setItem("wfm.contextmenu.inprlist"  ,  '<spring:message code="wfm.contextmenu.inprlist"  />');
        sessionStorage.setItem("wfm.contextmenu.waitlist"  ,  '<spring:message code="wfm.contextmenu.waitlist"  />');
        sessionStorage.setItem("wfm.contextmenu.alarmlist" ,  '<spring:message code="wfm.contextmenu.alarmlist" />');
		
		<%  }  } catch (Exception e) { } %>  ;
		

 </script>
</head>
</html>