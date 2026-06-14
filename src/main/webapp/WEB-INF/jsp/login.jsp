<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ include file="common/common-header.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
	<!-- jQuery 3 -->
	<script src="<%=baseUrl %>adminLTE/bower_components/jquery/dist/jquery.min.js"></script>
	<!-- Bootstrap 3.3.7 -->
	<script src="<%=baseUrl %>adminLTE/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
	<!-- bootstrap validator -->
	<script src="<%=baseUrl %>bootstrap-validator/dist/js/bootstrapValidator.min.js"></script>
	<script src="<%=baseUrl %>adminLTE/bower_components/jquery/dist/jquery.form.min.js"></script>
	<script src="<%=baseUrl %>script/login.js"></script>
<title>欢迎登录WFM系统</title>

<style>
            /*web background*/
            .container{
                display:table;
                height:100%;
            }
 
            .row{
                display: table-cell;
                vertical-align: middle;
            }
            /* centered columns styles */
            .row-centered {
                text-align:center;
            }
            .col-centered {
                display:inline-block;
                float:none;
                text-align:left;
                margin-right:-4px;
            }
        </style>
</head>
<body class="hold-transition skin-purple">
	<header class="main-header">
		<!-- <div class="navbar-custom-menu" style="margin-right:100px">
			<label>语言</label>
			&nbsp;&nbsp;
			<select id="langId" class="select2">
                  <option selected="selected" value="zh_CN">中文简体</option>
                  <option  value="en_US">English</option>
                  <option>中文繁体</option>
                </select>
		</div> -->
	</header>
	<div class="container">
		<div class="row row-centered">
		<div class="well col-md-6 col-centered">
          <!-- Horizontal Form -->
          <div class="box box-info">
            <div class="box-header with-border">
              <h3 class="box-title">欢迎登录WFM系统</h3>
            </div>
            <!-- /.box-header --><!-- action="service/api/welcomindex?lang=zh_CN" -->
            <!-- form start -->
            <form id="loginForm" class="form-horizontal"  method="post">
              <div class="box-body">
                <div class="form-group">
                  <label for="userID" class="col-sm-2 control-label">用户ID</label>

                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="username" placeholder="用户ID" name="username">
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputPassword3" class="col-sm-2 control-label">密码</label>

                  <div class="col-sm-10">
                    <input type="password" class="form-control" id="password" placeholder="密码" name="password">
                  </div>
                </div>
                <div class="form-group">
                	<c:if test="${ErrMsg != null}">
		                <div id="prompt" class="col-sm-offset-2 col-sm-10">
		                    <font color="red">${ErrMsg}</font>
		                </div>
                  	</c:if>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <div class="checkbox" style="float:left;">
                      <label>
                        <input type="checkbox" name="remember-me"> 记住我
                      </label>
                    </div>
                    <div class="checkbox" style="float:left;">
			         <label>语言</label>
			         <select id="langId" class="select2">
                      <option selected="selected" value="zh_CN">中文简体</option>
                      <option value="zh_TW">中文繁體</option>
                      <option  value="en_US">English</option>
                     </select>
		            </div> 
                    
                  </div>
                </div>
              </div>
              <!-- /.box-body -- ><!-- onclick="loginSys()" -->
               <div class="box-footer">
                <input id="loginid" type="button"   class="btn btn-info pull-right" value="登录" />
              </div> 
              <!-- /.box-footer -->
            </form>
           
          </div>
  		</div>
  		</div>
  	</div>
</body>
</html>