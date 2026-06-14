<%@ page language="java" contentType="text/html; charset=utf-8" import="java.net.URLEncoder,java.io.*"
	pageEncoding="utf-8"%>
<%@ include file="../common/common-header.jsp"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

	
	
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	
	<jsp:include page="../common/common-header.jsp"></jsp:include>
	<!-- jQuery 3 -->
	<script src="<%=baseUrl %>adminLTE/bower_components/jquery/dist/jquery.min.js"></script>
	<!-- Bootstrap 3.3.7 -->
	<script src="<%=baseUrl %>adminLTE/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
	<!-- AdminLTE App -->
	<script src="<%=baseUrl %>adminLTE/dist/js/adminlte.min.js"></script>
	<!-- DataTables -->
	<script src="<%=baseUrl %>adminLTE/bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
	<script src="<%=baseUrl %>adminLTE/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
	<!-- SlimScroll -->
	<script src="<%=baseUrl %>adminLTE/bower_components/jquery-slimscroll/jquery.slimscroll.min.js"></script>
	<!-- FastClick -->
	<script src="<%=baseUrl %>adminLTE/bower_components/fastclick/lib/fastclick.js"></script>
	<!-- bootstrap validator -->
	<script src="<%=baseUrl %>bootstrap-validator/dist/js/bootstrapValidator.min.js"></script>
	<!-- bootstrap duallistbox -->
	<script src="<%=baseUrl %>bootstrap-duallistbox/jquery.bootstrap-duallistbox.min.js"></script>
	<!-- Select2 -->
	<script src="<%=baseUrl %>adminLTE/bower_components/select2/dist/js/select2.full.min.js"></script>

	<script src="<%=baseUrl %>adminLTE/plugins/iCheck/icheck.min.js"></script>
	<!-- jquery-ui-sortable  -->
	<script src="<%=baseUrl %>adminLTE/bower_components/jquery-ui-sortable/sortable.js"></script>
	<script src="<%=baseUrl%>script/common/common-utils.js"></script>
	<script src="<%=baseUrl%>script/setting/svg_file_upload.js"></script>
	

<title>SVG File Upload / DonwLoad </title>
</head>
<body class="hold-transition skin-purple sidebar-mini">
	<div class="wrapper">
		<jsp:include page="../common/common-navigator.jsp"></jsp:include>
		<jsp:include page="../common/common-sidebar.jsp"></jsp:include>
		
		<!-- Content Wrapper. Contains page content -->
		<div class="content-wrapper">
			<!-- Content Header (Page header) -->
			<section class="content-header">
				<h1>SVG File Upload / DonwLoad </h1>
			</section>
			<!-- Main content -->
			<!-- Search Form -->
			<section class="content-header">
				<div class="box box-danger">
					<!-- <div class="box-header with-border">
						<h3 class="box-title"> 选择 SVG 文件 </h3>
					</div> -->
					<div class="box-body">
						<div class="row">	
						  <form id='uploadForm' method="post" action="/form" enctype="multipart/form-data">
							<!-- <label for="select_svg_file" class="col-sm-3 control-label">选择 SVG 文件 </label> -->
							<div class="col-sm-3">					
								<input class="style_file_content" accept=".svg" type="file" id="svgFile" style="height: 30px; width: 280px;"/>
							</div>
							<div class="col-sm-4">
                               <label for="floorNoSelect" style="padding-top: 5px !important; float:left "><spring:message code="wfm.floor_no"/>: &nbsp; </label>
                               <select id="floorNoSelect" name="lotTypeSelect" style="padding-top: 5px;width:150px;!important;float:left;">
                                   <option value="">--Please Select--</option>
                               </select>
                            </div>
							<div class="col-sm-5">
								<button id="uploadBtn" type="button" class="btn btn-info"><spring:message code="wfm.upload"/></button>&nbsp;&nbsp;
								<button id="refreshBtn" type="button" class="btn btn-info"><spring:message code="wfm.refresh"/></button>&nbsp;&nbsp;
							</div>
						</form>
							
						</div>
					</div>
					<!-- /.box-body -->
				</div>
			</section>
			<!-- Data Table-->
			<section class="content container-fluid">
				<div class="row">
					<div class="col-xs-12">
						<div id="databox" class="info-box">
							<div class="box-header">
								<h3 class="box-title"> SVG File List </h3>
							</div>
							<div id="datalist" class="box-body">
								<table id="grouplist" class="table table-bordered table-striped">
								<thead><tr><th  style="width:10px !important" ></th>
								<th><spring:message code="wfm.filename"/></th>
								<th style='display: none;'></th>
								<th><spring:message code="wfm.floor_no"/></th>
								<th style="max-width:100px !important"><spring:message code="wfm.filesize"/></th>
								<th style="max-width:120px !important"><spring:message code="wfm.default.fabview"/></th>
								<th style="width:300px !important"><spring:message code="wfm.md5sum"/> </th>
								<th><spring:message code="wfm.uploaded.by"/></th>
								<th><spring:message code="wfm.uploaded.date"/> </th>
								</tr></thead>
								<tbody></tbody>
								<tfoot><tr><th colspan='6'>
								<label><spring:message code="wfm.selectall"/></label>&nbsp;&nbsp;<input type="checkbox" id="selectAll" class="minimal"/>&nbsp;&nbsp;
								<button id="setDefaultBtn" type="button" class="btn btn-info"><spring:message code="wfm.set.default.fabview"/></button> &nbsp;&nbsp;
								<button id="deleteBtn" type="button" class="btn btn-info"><spring:message code="wfm.delete"/></button> &nbsp;&nbsp;
								</th></tr></tfoot></table>
							</div>
						</div>
					</div>

				</div>
			</section>
			<!-- /.content -->
		</div>

		</div>
		
	</div>
	<!-- ./wrapper -->
</body>
</html>