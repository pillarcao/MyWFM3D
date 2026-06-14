<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ include file="common/common-header.jsp"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
	<!-- jQuery 3 -->
	<script src="<%=baseUrl %>adminLTE/bower_components/jquery/dist/jquery.min.js"></script>
	<!-- Bootstrap 3.3.7 -->
	<script src="<%=baseUrl %>adminLTE/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
	<!-- AdminLTE App -->
	<script src="<%=baseUrl %>adminLTE/dist/js/adminlte.min.js"></script>
	<script src="<%=baseUrl%>script/welcome.js"></script>
<title>首页</title>
</head>
<body>
<body class="hold-transition skin-purple sidebar-mini">
	<div class="wrapper">
	<jsp:include page="common/common-navigator.jsp"></jsp:include>
	<jsp:include page="common/common-sidebar.jsp"></jsp:include>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        Web Floor Monitor
        <!-- <small>Optional description</small> -->
      </h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Level</a></li>
        <li class="active">Here</li>
      </ol>
    </section>

    <!-- Main content -->
    <section class="content container-fluid">

    <img src="<%=baseUrl%>header_BG.png" height="430" width="1010" />

    
      <!--------------------------
        | Your Page Content Here |
        -------------------------->

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->

  <!-- Main Footer -->
  <jsp:include page="common/common-footer.jsp"></jsp:include>
</div>
</body>


</html>