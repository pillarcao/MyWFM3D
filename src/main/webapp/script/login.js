$(document).ready(function(){
	$("input").focus(function(){
		$("#prompt").hide();
	});
});

$(function () {
    var url = sessionStorage.getItem("wfm_language");
	if(url == null){
		url = "";
	}
	if(url.indexOf("zh_CN") >= 0 ){
		$("#langId").val("zh_CN")
	} else if(url.indexOf("en_US") >= 0 ){
		$("#langId").val("en_US")
	}else if(url.indexOf("zh_TW") >= 0 ){
		$("#langId").val("zh_TW")
	}else{
		url='?lang=zh_CN';
		sessionStorage.setItem("loginUrl", url);
	}
	$('#loginForm').bootstrapValidator({
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
				},
    fields: {
    	username: {
            validators: {
                notEmpty: {
                    message: '用户id不能为空'
                }
            }
        },
        password: {
            validators: {
                notEmpty: {
                    message: '密码不能为空'
                }
            }
        }
    }
});	
	
	$("#langId").change(function(){
	      var data= $(this).val();
	      var loginUrl;
	      if(data==='zh_CN'){
	    	  loginUrl='?lang=zh_CN';
	      }else if(data=='en_US'){
	    	  loginUrl='?lang=en_US';
	      }else{
	    	  loginUrl='?lang=zh_TW';
	      } 
	      sessionStorage.setItem("loginUrl",loginUrl);
		});
		
	$("#loginid").click(function(){
		loginId_OnClick();
	}); 
	
	$("#password").keydown(function(event){
		var e = event || window.event;
		if(e.keyCode == 13 || e.keyCode == 10  ){
			loginId_OnClick();
		}
	});

	function loginId_OnClick(){
		$('#loginForm').data('bootstrapValidator').validate();
		if($('#loginForm').data('bootstrapValidator').isValid()){
			var username = $("#username").val();
			var password = $("#password").val();
			$.ajax({
				url: "auth/token",
				type: "POST",
				async: false,
				data:{'username':username,'password':password},
				success : function(data){
					if(data.code && data.code == '403') {
						//window.location.href="/pms-component-client/forward.jsp";
						window.location.href="/wfm-component-client/forward.jsp";
					}
					else if(data == '10101'){
                        alert("用户名或密码错误!");
                    }
					else {
						sessionStorage.setItem("token",'Bearer '+data);
						sessionStorage.setItem("userName",username);
                        //
                        $.ajax({
                        		url:"auth/getUserInfo",
                        		type:'GET',
                        		async: false,
                        		beforeSend: function(request) {
                                    request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
                        		},
                        		data: {'userid':username},
                        		success : function(data){
                                    sessionStorage.setItem("userNameDesc",data.userName);
                        		},
                        		error:function(jqXHR, textStatus, errorThrown){
                        			alert(jqXHR.responseText);
                        			console.log(jqXHR.responseText);
                        		}
                        	});
                        //
						var url=sessionStorage.getItem("loginUrl");
						if(url==null){
							url='?lang=zh_CN&';
							sessionStorage.setItem("loginUrl",url);
						}
						window.location.href='/wfm-component-client/service/api/welcome' + url; //+'?token=Bearer '+data;
					}
				},
				error:function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR.responseText);
					if(jqXHR.status == 403) {
						$(window).attr('location','');
					}
				}
			});
		}
	}

});