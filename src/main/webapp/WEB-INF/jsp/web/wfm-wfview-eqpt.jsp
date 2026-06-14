<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ include file="../common/common-header.jsp" %>
<%@
        taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ page import="java.io.*" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>WFM WAFERVIEW</title>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="<%=baseUrl %>adminLTE/dist/css/AdminLTE.min.css">
<link rel="stylesheet" type="text/css" href="<%=baseUrl %>css/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%=baseUrl %>css/handsontable.full.min.css">
<link rel="stylesheet" type="text/css" href="<%=baseUrl %>css/wfm-core.css">
<link rel="stylesheet" type="text/css" href="<%=baseUrl %>css/wfm-wfview.css">
<script type="text/javascript" charset="utf-8" src="<%=baseUrl%>script/web/jquery-3.0.0.js"></script>
<script type="text/javascript" charset="utf-8" src="<%=baseUrl%>script/web/jquery-ui.js"></script>
<script type="text/javascript" charset="utf-8" src="<%=baseUrl%>script/web/handsontable.full.min.js"></script>
<script src="<%=baseUrl%>script/web/Util.js"></script>
<script src="<%=baseUrl%>script/web/Form.js"></script>
<script src="<%=baseUrl%>script/web/wfm-wfview-eqpt.js"></script>

</head>
<body>
    <h1 id="showTitle" style="font-size: 20px;"></h1>
	<div id="contents" >
		<div class="table">
			<div class="table-row">
				<div class="table-cell">
					<div class="table">
						<div class="table-row">
							<div class="table-cell">Equipment ID</div>
							<div class="table-cell">
								<div id="eqp_id" class="wfm-textbox wfm-locked">&nbsp;</div>
							</div>
							<div class="table-cell">
								<div id="eqp_name" class="wfm-textbox wfm-locked">&nbsp;</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="table-row">
				<div class="table-cell">
					<fieldset id="group-stat">
						<legend>Status</legend>
						<div class="table">
							<div class="table-row">
								<div class="table-cell">Mode</div>
								<div class="table-cell">
									<div id="eqp_mode" class="wfm-textbox wfm-locked">&nbsp;</div>
								</div>
								<div class="table-cell">Current Recipe ID</div>
								<div class="table-cell">
									<div id="recip_id" class="wfm-textbox wfm-locked">&nbsp;</div>
								</div>
							</div>
							<div class="table-row">
								<div class="table-cell">Status</div>
								<div class="table-cell">
									<div id="eqp_stat" class="wfm-textbox wfm-locked">&nbsp;</div>
								</div>
								<div class="table-cell">
									<!-- サブステータス -->
								</div>
								<div class="table-cell">
									<!-- <div id=""></div> -->
								</div>
							</div>
						</div>
					</fieldset>
					<br />
				</div>
			</div>
			<div class="table-row">
				<div class="table-cell">
					<div id="list"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
