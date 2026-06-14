<%@ page language="java" contentType="text/html; charset=utf-8"
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
	<!-- jquery.colorpicker.js -->
	<script src="<%=baseUrl %>adminLTE/bower_components/jquery-colorpicker/jquery.colorpicker.js"></script>
	<script src="<%=baseUrl%>script/common/common-utils.js"></script>
	<script src="<%=baseUrl%>script/setting/color_def.js"></script>

<title>Color Define </title>
</head>
<body class="hold-transition skin-purple sidebar-mini">
	<div class="wrapper">
		<jsp:include page="../common/common-navigator.jsp"></jsp:include>
		<jsp:include page="../common/common-sidebar.jsp"></jsp:include>
		
		<!-- Content Wrapper. Contains page content -->
		<div class="content-wrapper">
			<!-- Content Header (Page header) -->
			<section class="content-header">
				<h1>Color Define </h1>
			</section>
			<!-- Main content -->
			<!-- Search Form -->
			<!-- <section class="content container-fluid"> -->
	<section class="content-header">
		<div class="box box-danger">
		<!-- <div class="box-body"> -->
			<div class="row" id='div_colorDefineRow' style="display: none;">

				<div class="col-md-3" style="min-width: 450px !important; padding-left: 25px;  ">
				  <div class="box direct-chat direct-chat-primary" style="border:2px solid #8899BB; border-radius: 5px; box-shadow: #ddd 4px 4px 6px 3px ; ">
					<div class="box-header with-border" 
						style="padding-top: 0px; " >
					  <span style="padding-top:12px; ">
						  <h3 class="box-title" style="padding-top: 10px !important; padding-bottom: 0px; " >
								EQP State
						  </h3>
						</span>
		
					  <div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						<!-- <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle">
						  <i class="fa fa-circle-o"></i></button> -->
					  </div>
					</div>
	
					<div class="box-body">
					  <div class="direct-chat-messages" style="height: 98%; ">
						<div class="direct-chat-msg" style="padding-bottom: 0px !important; margin-bottom: 0px !important;">

							<table id="grouplist_eqp" class="table table-bordered table-striped" style="text-align: center;">
								<thead ><tr>
								<th style="text-align: center; width:100px !important"><spring:message code="wfm.status.category"/></th>
								<th style="text-align: center; width:80px  !important"><spring:message code="wfm.background.color"/></th>
								<th style="text-align: center; width:100px !important"><spring:message code="wfm.font.color"/></th>
								</tr></thead>
								<tbody>
							   
									<!-- <tr> 
										<td id="td_EQP_STATE_DWT"  style="padding-top: 2px; margin-top: 2px; margin-bottom: 2px; background-color: red !important; " >
											<div style="padding: 2px; background-color: blue;">
												<label for="EQP_STATE_BG_DWT" style="width:80px !important;padding-top: 5px; padding-bottom: 0px;"  >DWT</label>
											</div>
										</td>
										<td style="padding-top: 2px;  padding-bottom: 2px; margin-top: 2px; margin-bottom: 2px;">
											<input id="EQP_STATE_BG_DWT" type="text" name="EQP_STATE_BG_DWT"
											class="form-control" placeholder="" style="width: 100px;"> 
										</td>
										<td style="padding-top: 2px; padding-bottom: 2px; margin-top: 2px; margin-bottom: 2px;" >
											<input id="EQP_STATE_FG_DWT" type="text" name="EQP_STATE_FG_DWT"
											class="form-control" placeholder="" style="width: 100px;"> 
										</td>
									</tr>

									<tr>
										<td style="width:140px !important"><label for="EQP_STATE_BG_NST">NST</label>
										</td>
										<td>
											<input id="EQP_STATE_BG_NST" type="text" name="EQP_STATE_BG_NST"
											class="form-control" placeholder="" style="width: 100px;"> 
										</td>
										<td>
											<input id="EQP_STATE_FG_NST" type="text" name="EQP_STATE_FG_NST"
											class="form-control" placeholder="" style="width: 100px;"> 
										</td>
									</tr>   -->
								</tbody>
								<tfoot>
									<tr>
										<th colspan='3' >
											<div class="modal-footer" style="padding-top: 10px; padding-bottom: 5px;"  >
												<button id="refreshBtn_eqp" type="button" class="btn btn-info pull-left"><spring:message code="wfm.refresh"/></button> 
												<!-- <button id="resetToDefaultBtn_eqp" type="button" class="btn btn-warning">还原为默认值</button>  -->
												<button id="confirmBtn_eqp" type="button" class="btn btn-info"><spring:message code="wfm.confirm"/></button> 
											</div>
										</th>
									</tr>
								</tfoot>
							</table>

						</div>
					  </div>
	
					</div>
				  </div>
				</div> <!-- end EQP STATE  -->

			<!-- end row STATE  -->
			<!-- </div> -->

			<!--
				<div class="col-md-3" style="min-width: 560px !important; padding-left: 25px; float:left !important;">
				  <div class="box direct-chat direct-chat-primary" style="border:2px solid #8899BB; border-radius: 5px; box-shadow: #ddd 4px 4px 6px 3px ; ">
					<div class="box-header with-border" 
						style="padding-top: 0px; " >
					  <span style="padding-top:12px; ">
						  <h3 class="box-title" style="padding-top: 10px !important; padding-bottom: 0px;" >
								Chamber State 
						  </h3>
						</span>
		
					  <div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					  </div>
					</div>
	
					<div class="box-body">
	
					  <div class="direct-chat-messages" style="height: 98%; ">
						<div class="direct-chat-msg" style="padding-bottom: 0px !important; margin-bottom: 0px !important;">

							<table id="grouplist_chamber" class="table table-bordered table-striped" style="text-align: center;">
								<thead ><tr>
								<th style="text-align: center; width:80px !important"><spring:message code="wfm.status.category"/></th>
								<th style="text-align: center; width:80px !important"><spring:message code="wfm.background.color"/></th>
								</tr></thead>
								<tbody>
				
								</tbody>
								<tfoot>
									<tr>
										<th colspan='4' >
											<div class="modal-footer" style="padding-top: 10px; padding-bottom: 5px;"  >
												<button id="refreshBtn_chamber" type="button" class="btn btn-info pull-left"><spring:message code="wfm.refresh"/></button> 
												<button id="resetToDefaultBtn_chamber" type="button" class="btn btn-warning">还原为默认值</button> 
												<button id="confirmBtn_chamber" type="button" class="btn btn-info"><spring:message code="wfm.confirm"/></button> 
											</div>
										</th>
									</tr>
								</tfoot>
							</table>

						</div>
					  </div>
	
					</div>
				  </div>
				</div> 
				 -->
				<!-- end Chamber STATE  -->

<!-- Port STATE  -->
				<div class="col-md-3" style="min-width: 380px !important; padding-left: 0px; float:left !important;">
				  <div class="box direct-chat direct-chat-primary" style="border:2px solid #8899BB; border-radius: 5px; box-shadow: #ddd 4px 4px 6px 3px ; ">
					<div class="box-header with-border" 
						style="padding-top: 0px; " >
					  <span style="padding-top:12px; ">
						  <h3 class="box-title" style="padding-top: 10px !important; padding-bottom: 0px;" >
								Port State 
						  </h3>
						</span>
		
					  <div class="box-tools pull-right">
						<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						<!-- <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle">
						  <i class="fa fa-circle-o"></i></button> -->
					  </div>
					</div>
	
					<div class="box-body">
	
					  <div class="direct-chat-messages" style="height: 98%; ">
						<div class="direct-chat-msg" style="padding-bottom: 0px !important; margin-bottom: 0px !important;">

							<table id="grouplist_port" class="table table-bordered table-striped" style="text-align: center; ">
								<thead ><tr>
								<th style="text-align: center; width:80px !important"><spring:message code="wfm.status.category"/></th>
								<th style="text-align: center; width:80px !important"><spring:message code="wfm.background.color"/></th>
								</tr></thead>
								<tbody>
									
								</tbody>
								<tfoot>
									<tr>
										<th colspan='2' >
											<div class="modal-footer" style="padding-top: 10px; padding-bottom: 5px;"  >
												<button id="refreshBtn_port" type="button" class="btn btn-info pull-left"><spring:message code="wfm.refresh"/></button> 
												<!-- <button id="resetToDefaultBtn_port" type="button" class="btn btn-warning">还原为默认值</button>  -->
												<button id="confirmBtn_port" type="button" class="btn btn-info"><spring:message code="wfm.confirm"/></button> 
											</div>
										</th>
									</tr>
								</tfoot>
							</table>

						</div>
					  </div>
	
					</div>
				  </div>
				</div> <!-- end Port STATE  -->

<!-- EQP mode  -->
				<div class="col-md-3" style="min-width: 380px !important; padding-left: 0px; ">
					<div class="box direct-chat direct-chat-primary" style="border:2px solid #8899BB; border-radius: 5px; box-shadow: #ddd 4px 4px 6px 3px ; ">
					  <div class="box-header with-border"
						  style="padding-top: 0px; " >
						<span style="padding-top:12px; ">
							<h3 class="box-title" style="padding-top: 10px !important; padding-bottom: 0px;" >
								  EQP Mode
							</h3>
						  </span>

						<div class="box-tools pull-right">
						  <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						  <!-- <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle">
							<i class="fa fa-circle-o"></i></button> -->
						</div>
					  </div>

					  <div class="box-body">
						<div class="direct-chat-messages" style="height: 98%; ">
						  <div class="direct-chat-msg" style="padding-bottom: 0px !important; margin-bottom: 0px !important;">

							  <table id="grouplist_eqpMode" class="table table-bordered table-striped" style="text-align: center; ">
								  <thead ><tr>
								  <th style="text-align: center; width:80px !important"><spring:message code="wfm.status.category"/></th>
								  <th style="text-align: center; width:80px !important"><spring:message code="wfm.border.color"/></th>
								  </tr></thead>
								  <tbody>

								  </tbody>
								  <tfoot>
									  <tr>
										  <th colspan='2' >
											<div class="modal-footer" style="padding-top: 10px; padding-bottom: 5px;"  >
												<button id="refreshBtn_eqpMode" type="button" class="btn btn-info pull-left"><spring:message code="wfm.refresh"/></button>
												<!-- <button id="resetToDefaultBtn_eqpCategory" type="button" class="btn btn-warning">还原为默认值</button>  -->
												<button id="confirmBtn_eqpMode" type="button" class="btn btn-info"><spring:message code="wfm.confirm"/></button>
											</div>
										</th>
									  </tr>
								  </tfoot>
							  </table>
							</div>
							</div>
						</div>
					</div>
				</div>
<!-- Vehicle State  -->
             <div class="col-md-3" style="min-width: 450px !important; padding-left: 25px; ">
			 <div class="box direct-chat direct-chat-primary" style="border:2px solid #8899BB; border-radius: 5px; box-shadow: #ddd 4px 4px 6px 3px ; ">
			     <div class="box-header with-border" style="padding-top: 0px; " >
						<span style="padding-top:12px; ">
							<h3 class="box-title" style="padding-top: 10px !important; padding-bottom: 0px;" >
								  Vehicle State
							</h3>
						</span>
						<div class="box-tools pull-right">
						  <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						  <!-- <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle">
							<i class="fa fa-circle-o"></i></button> -->
						</div>
					  </div>

					  <div class="box-body">
						<div class="direct-chat-messages" style="height: 98%; ">
						  <div class="direct-chat-msg" style="padding-bottom: 0px !important; margin-bottom: 0px !important;">
							  <table id="grouplist_vehicleState" class="table table-bordered table-striped" style="text-align: center; ">
								  <thead ><tr>
								  <th style="text-align: center; width:80px !important"><spring:message code="wfm.status.category"/></th>
								  <th style="text-align: center; width:80px !important"><spring:message code="wfm.border.color"/></th>
								  </tr></thead>
								  <tbody>
								  </tbody>
								  <tfoot>
									  <tr>
										  <th colspan='2' >
											<div class="modal-footer" style="padding-top: 10px; padding-bottom: 5px;"  >
												<button id="refreshBtn_vehicleState" type="button" class="btn btn-info pull-left"><spring:message code="wfm.refresh"/></button>
												<button id="confirmBtn_vehicleState" type="button" class="btn btn-info"><spring:message code="wfm.confirm"/></button>
											</div>
										  </th>
									  </tr>
								  </tfoot>
							  </table>
							</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		<!-- </div> -->
		</div>
	</section>

		</div>

		</div>
		
	</div>
	<!-- ./wrapper -->
</body>
</html>