<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<!DOCTYPE html>
<%
    String  baseUrl = request.getScheme()+"://"
                        +request.getServerName()+":"
                        +request.getServerPort()
                        +request.getContextPath()+"/";
%>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Forward</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- jQuery 3 -->
  <script src="<%=baseUrl %>adminLTE/bower_components/jquery/dist/jquery.min.js"></script>
  <style>
		.mask{
		  display: block;
		  position: fixed;
		  top: 0;
		  left: 0;
		  width: 100%;
		  height: 100%;
		  background: #000;
		  filter: alpha(opacity=30);
		  -ms-filter: "alpha(opacity=30)";
		  opacity: .3;
		  z-index: 10000;
		}
		.center{
		    display: block;
		    position: fixed;
		    _position: absolute;
		    top: 50%;
		    left: 50%;
		    width: 666px;
		    height:400px;
		    margin-left: -333px;
		    margin-top: -200px;
		    z-index: 10001;
		    background-color: #fff;
		}
   </style>
</head>
<body>
	<div class="mask">
  		<div class="center">
	          	<h2>认证失败，请重新登陆。<font color="red"><span id="last">5</span></font>秒后自动进入登陆页面。<a href="<%=baseUrl %>service/auth/login">立即登陆</a></h2>
		</div>
	</div>
</body>
<script type="text/javascript">
$(document).ready(function() {
    function jump(count) {      
        window.setTimeout(function(){      
            count--;      
            if(count > 0) {      
                $('#last').html(count);      
                jump(count);      
            } else {      
                location.href="<%=baseUrl %>service/auth/login";      
            }      
        }, 1000);      
    }      
    jump(5);      
});  
</script>
</html>
