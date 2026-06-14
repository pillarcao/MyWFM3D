<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ include file="../common/common-header.jsp" %>
<%@
        taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ page import="java.io.*" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
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

    <script src="<%=baseUrl %>d3/d3.js"></script>

    <script src="<%=baseUrl%>script/wfm/monitor.js"></script>

    <title>WFM Monitor</title>

    <style>
        section > .content {
            top: 0px !important;
        }

        .content-header > .breadcrumb {
            top: 2px !important;
            z-index: 200 !important;
        }

        .info-box {
            left: 0px !important;
        }
        
        .contextmenu {
            display: none;
            position: absolute;
            width: 200px;
            line-height: 0.2;
            background: #FFFFFF;
            border-radius: 10px;
            overflow: hidden;
            z-index: 99;
            border-style: groove;
            border-width: 2px;
            border-color: blue;
        }
       .cs_1 {
        border-left: 10px solid transparent;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 600;
        }
       .contextmenu h5 {
        border-left: 10px solid transparent;
        font-size: 16px;
        font-weight: bold;
        color: blue;
        }
      .contextmenu li {
        border-left: 1px solid transparent;
        transition: ease 0.3s;
        font-weight: 600;
        margin-left: 1px;
//        list-style-type:none;
        }

      .contextmenu li:hover {
        background: #66CCFF;
        border-left: 1px solid #9C27B0;
       }

      .contextmenu li a {
        display: block;
        padding: 10px;
        color: #000000;
        text-decoration: none;
        transition: ease 0.3s;
       }

      .contextmenu li:hover a {
           color: #FF0000;
       }
    </style>
</head>
<body class="hold-transition skin-purple sidebar-mini">
<div class="wrapper">
    <jsp:include page="../common/common-navigator.jsp"></jsp:include>
    <jsp:include page="../common/common-sidebar.jsp"></jsp:include>

    <div class="content-wrapper" style="min-width: 800px !important;">
        <section class="content-header"
                 style="padding-top: 0px !important; padding-bottom: 10px !important; z-index:200 !important; background-color: beige;">
            <table style="padding: 0px !important; margin: 0px !important;">
                <tr style="padding: 0px !important; margin: 0px !important;">
                    <td style="padding: 0px !important; margin: 0px !important; line-height: 20px;">
                        <h3 style="padding-top: 10px !important; margin: 0px !important; width: 270px !important;">
                            Web Floor Monitor
                        </h3>
                    </td>
                    <td style="padding: 0px !important; margin: 0px !important; width: 240px !important; " >
                        <div style="display: block; padding-top: 10px !important">
                            <label for="floorNoSelect" style="padding-top: 5px !important; float:left " ><spring:message code="wfm.floor_no"/>: &nbsp; </label>
                            <select id="floorNoSelect" name="lotTypeSelect" class="form-control input-sm" style="width:140px !important;float:left; ">
                                <option value="">--Please Select--</option>
                            </select>
                        </div>
                    </td>
                    <td style="padding: 0px !important; margin: 0px !important;">
                        <a href="<%=baseUrl %>api/wfm_monitor3d" class="btn btn-default btn-sm" style="margin-top: 6px;">
                            <i class="fa fa-cube"></i> 切换到 3D
                        </a>
                    </td>
                </tr>
            </table>
            <!-- <h1 style="padding-top: 15px !important; max-width: 280px !important;">
                Web Floor Monitor
            </h1> -->

            <div style="padding-top: 0px !important;" class="breadcrumb" id="HeaderViewZone"/>
            
        </section>

        <section class="content container-fluid" style="padding-top: 5px !important; padding-left: 5px !important; padding-bottom: 1px !important;">
            <div class="row" style="z-index:10 !important; text-align: left !important; ">
                <div class="col-xs-12" style="z-index:10 !important; text-align: left !important;">
                    <div class="row" id="FabViewZone"
                         style="padding-left: 5px !important; z-index:1 !important; background-color:#fff; text-align: left !important;">
                    </div>
                    <div id="EqpViewZone">
                        <div class="row" id="EqpView_autoDraw" style="width: 100%; overflow: scroll; display:none "></div>
                        <div class="row" id="EqpView_svgZone" style="width: 100%; overflow: scroll; display:none "></div>
                    </div>  <!-- end databox  -->
                </div>  <!-- end col-xs-12  -->
            </div> <!-- end row  -->
            <div class="row" style="z-index:10 !important; text-align: left !important; margin: 0px !important;">
               <label id="eqp_status_cnt" style="padding-left: 10px !important; margin: 0px !important; font-weight:normal !important;" >
                 </label>
            </div>
        </section>
        
			<div class="contextmenu">
				<h5><div id="eqp_name">Equipment Information</div></h5>
				<hr/>
					<div class="cs_1" id="eqp_id">EQP ID:</div>
					<div class="cs_1" id='status'>Status:</div>
					<div class="cs_1" id='mode'>Mode:</div>
				<hr/>
				<ul style="margin-left: -20px;">
					<li><a id='inprlist' href="">Processing Lot List</a></li>
					<li><a id='waitlist' href="">Reserved Lot List</a></li>
					<li><a id='alarmlist' href="">Alarm List</a></li>
				</ul>
			</div>

			<!-- /.content-wrapper -->
        <div class="modal fade" id="modal-addGroup" data-backdrop="static">
            <div class="modal-dialog" id="modal-dialog" style="min-width: 960px !important;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id='modal-dialog-title'></h4>
                    </div>
                    <div class="modal-body" style="padding: 1px !important; ">
                        <div>
                            <div class="box box-primary">
                                <!-- form start -->
                                <form role="form" id="addGroupForm">
                                    <div class="box-body">

                                        <!-- Data Table-->
                                        <section class="content container-fluid" style="padding: 0px !important;">
                                            <div class="row">
                                                <div class="col-xs-12"
                                                     style="margin-bottom: 0px !important; padding-bottom: 0px !important;">
                                                    <div id="databox" class="info-box"
                                                         style="overflow: scroll; margin-bottom: 0px !important; padding-bottom: 0px !important; width: 100% !important">
                                                        <!-- <div class="box-header">
                                                            <h3 class="box-title"> SVG File List </h3>
                                                        </div> -->
                                                        <div id="datalist" class="box-body">
                                                            <table id="grouplist"
                                                                   class="table table-bordered table -striped" style="width: 100%;text-align:center;">
                                                                <thead>
                                                                <tr>
                                                                    <th style="width:8px !important"></th>
                                                                    <th style="text-align:center;">Vehicle ID</th>
                                                                    <th style="text-align:center;">State</th>
                                                                    <th style="text-align:center;">Empty Flag</th>
                                                                    <th style="text-align:center;">Current Location</th>
                                                                    <th style="text-align:center;">Current Distance</th>
                                                                    <th style="text-align:center;">Next Location</th>
                                                                    <th style="text-align:center;">Car ID</th>
                                                                    <th style="text-align:center;">Dest</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody></tbody>
                                                                <tfoot>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                        <!-- /.content -->

                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="closeAdd" class="btn btn-default pull-right"
                                    data-dismiss="modal"><spring:message code="wfm.close"/></button>
                            <!-- <button id="add" type="submit" class="btn btn-primary"><spring:message code="wfm.save"/></button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- /.content-wrapper -->
        <div class="modal fade" id="modal-eqpHisGroup" data-backdrop="static">
            <div class="modal-dialog" id="modal-eqpHisDialog" style="min-width: 960px !important;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id='modal-eqpHisDialog-title'></h4>
                    </div>
                    <div class="modal-body" style="padding: 1px !important; ">
                        <div>
                            <div class="box box-primary">
                                <!-- form start -->
                                <form role="form" id="eqpHisDialog-addGroupForm">
                                    <div class="box-body">

                                        <!-- Data Table-->
                                        <section class="content container-fluid" style="padding: 0px !important;">
                                            <div class="row">
                                                <div class="col-xs-12"
                                                     style="margin-bottom: 0px !important; padding-bottom: 0px !important;">
                                                    <div id="eqpHisDialog-databox" class="info-box"
                                                         style="overflow: scroll; margin-bottom: 0px !important; padding-bottom: 0px !important; width: 100% !important">
                                                        <!-- <div class="box-header">
                                                            <h3 class="box-title"> SVG File List </h3>
                                                        </div> -->
                                                        <div id="eqpHisDialog-datalist" class="box-body">
                                                            <table id="eqpHisDialog-grouplist"
                                                                   class="table table-bordered table -striped">

                                                                <thead>
                                                                <tr>
                                                                    <th style="width:8px !important"></th>
                                                                    <th style="min-width:200px !important" >Report Time Stamp </th>
                                                                    <th style="min-width:80px !important" >Eqp ID</th>
                                                                    <!-- <th>Cust ID</th> -->
                                                                    <th style="min-width:90px !important">Last Status</th>
                                                                    <th style="min-width:90px !important">New Status</th>
                                                                    <th style="min-width:90px !important">Claim UserId</th>
                                                                    <th style="min-width:260px !important" >Claim Memo</th>
                                                                    <th style="min-width:200px !important" >StartTime</th>
																	<th style="min-width:200px !important" >Stop Time</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody></tbody>
                                                                <tfoot>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </section>
                                        <!-- /.content -->

                                    </div>
                                </form>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" id="eqpHisDialog-closeAdd" class="btn btn-default pull-left"
                                    data-dismiss="modal"><spring:message code="wfm.close"/></button>
                            <!-- <button id="add" type="submit" class="btn btn-primary"><spring:message code="wfm.save"/></button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- ./wrapper -->
</body>
</html>
