<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ include file="../common/common-header.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script src="<%=baseUrl%>script/common/common-navigator.js"></script>
<title>Insert title here</title>
</head>
<body>
	<!-- Main Header -->
		<header class="main-header">

			<!-- Logo -->
			<div class="logo" id='WFM_LOGO'>
				<!-- mini logo for sidebar mini 50x50 pixels -->
				<!-- <span class="logo-mini"><b>IBM</b>WFM</span> -->
				<span class="logo-mini"><b>WFM</b></span>
				<!-- logo for regular state and mobile devices -->
				<span class="logo-lg"><b>IBM WFM</b></span>
			</div>

			<!-- Header Navbar -->
			<nav class="navbar navbar-static-top" role="navigation">
				<!-- Sidebar toggle button-->
				<a href="#" class="sidebar-toggle" data-toggle="push-menu"
					role="button" id='sidebarToggleBtn'> <span class="sr-only">Toggle navigation</span>
				</a>
				<div class="navbar-custom-menu">
        			<ul class="nav navbar-nav">
        				<li>
			               	<a id="welcome"><input id="wel-username" readonly="readonly" type="text"
			               	style="width:120px;height:21px;background:#605CA8; color:#FFF;text-align:right;
			               	BORDER-TOP-STYLE:none;BORDER-RIGHT-STYLE:none;BORDER-LEFT-STYLE:none;BORDER-BOTTOM-STYLE:none"/></a>  
			            </li>
						<li>
		            		<a id="logout"><spring:message code="wfm.logout"/> &nbsp;<i class="fa fa-circle-o-notch"></i></a>
		          		</li>
					</ul>
				</div>
			</nav>
		</header>
</body>
</html>