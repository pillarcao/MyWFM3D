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
    <!-- Select2 -->
    <script src="<%=baseUrl %>adminLTE/bower_components/select2/dist/js/select2.full.min.js"></script>

    <!-- three.js (global build r128) + OrbitControls + CSS2DRenderer -->
    <script src="<%=baseUrl %>three/three.min.js"></script>
    <script src="<%=baseUrl %>three/OrbitControls.js"></script>
    <script src="<%=baseUrl %>three/CSS2DRenderer.js"></script>
    <script src="<%=baseUrl %>three/GLTFLoader.js"></script>

    <script src="<%=baseUrl%>script/wfm/monitor3d.js"></script>

    <title>WFM Monitor 3D</title>

    <style>
        section > .content {
            top: 0px !important;
        }

        .content-header > .breadcrumb {
            top: 2px !important;
            z-index: 200 !important;
        }

        /* 3D view container fills the available space below the toolbar */
        #view3d {
            position: relative;
            width: 100%;
            height: calc(100vh - 140px);
            min-height: 480px;
            background: #0e1116;
            overflow: hidden;
        }

        #view3d canvas {
            display: block;
        }

        /* CSS2D port / equipment labels */
        .v3d-label {
            color: #fff;
            font-family: sans-serif;
            font-size: 11px;
            padding: 0 2px;
            background: rgba(0, 0, 0, 0.45);
            border-radius: 2px;
            pointer-events: none;
            white-space: nowrap;
        }
        .v3d-label.port {
            color: #ffe27a;
            font-weight: 600;
        }

        #view3d-tooltip {
            position: absolute;
            display: none;
            pointer-events: none;
            z-index: 50;
            background: rgba(20, 24, 30, 0.92);
            color: #fff;
            font-size: 12px;
            line-height: 1.4;
            padding: 6px 9px;
            border: 1px solid #3a8ee6;
            border-radius: 4px;
            white-space: nowrap;
        }

        /* hidden host that holds the injected SVG so getBBox()/getCTM() work */
        #svgGeomHost {
            position: absolute;
            left: -100000px;
            top: -100000px;
            visibility: hidden;
            width: 1px;
            height: 1px;
            overflow: hidden;
        }

        .v3d-toggle-btn {
            margin-top: 6px;
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
                            Web Floor Monitor (3D)
                        </h3>
                    </td>
                    <td style="padding: 0px !important; margin: 0px !important; width: 240px !important;">
                        <div style="display: block; padding-top: 10px !important">
                            <label for="floorNoSelect" style="padding-top: 5px !important; float:left "><spring:message code="wfm.floor_no"/>: &nbsp; </label>
                            <select id="floorNoSelect" name="floorNoSelect" class="form-control input-sm" style="width:140px !important;float:left; ">
                                <option value="">--Please Select--</option>
                            </select>
                        </div>
                    </td>
                    <td style="padding: 0px !important; margin: 0px !important;">
                        <a href="<%=baseUrl %>api/wfm_monitor" class="btn btn-default btn-sm v3d-toggle-btn">
                            <i class="fa fa-map-o"></i> 切换到 2D
                        </a>
                    </td>
                </tr>
            </table>
        </section>

        <section class="content container-fluid" style="padding-top: 5px !important; padding-left: 5px !important; padding-bottom: 1px !important;">
            <div class="row" style="z-index:10 !important; text-align: left !important;">
                <div class="col-xs-12" style="z-index:10 !important; text-align: left !important;">
                    <div id="view3d">
                        <div id="view3d-tooltip"></div>
                    </div>
                </div>
            </div>
            <div class="row" style="z-index:10 !important; text-align: left !important; margin: 0px !important;">
                <label id="eqp_status_cnt" style="padding-left: 10px !important; margin: 0px !important; font-weight:normal !important;"></label>
            </div>
        </section>

        <!-- offscreen host for the floor SVG, used only for geometry extraction -->
        <div id="svgGeomHost"></div>

        <!-- equipment context menu (reused logic from 2D monitor) -->
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
    </div>
</div>
<!-- ./wrapper -->
</body>
</html>
