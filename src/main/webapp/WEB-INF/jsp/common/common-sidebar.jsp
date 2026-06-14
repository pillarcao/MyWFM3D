<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ include file="../common/common-header.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Insert title here</title>
<script src="<%=baseUrl%>script/common/common-sidebar.js"></script>
</head>
<body>
<!-- Left side column. contains the logo and sidebar -->
		<aside class="main-sidebar">

			<!-- sidebar: style can be found in sidebar.less -->
			<section class="sidebar">

				<!-- Sidebar Menu -->
				<ul class="sidebar-menu" data-widget="tree">
					<li><input id="active_menu" type="text" hidden="hidden"/></li>
					<li><input id="active_page" type="text" hidden="hidden"/></li>
					<li class="header">MENU</li>
				</ul>
				<!-- /.sidebar-menu -->
			</section>
			<!-- /.sidebar -->
		</aside>
</body>
</html>