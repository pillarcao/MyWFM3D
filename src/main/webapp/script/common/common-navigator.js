$(document).ready(function(){
//	var userName = sessionStorage.getItem("userName");
//	$("#wel-username").val("Welcome, " + userName);
	var userNameDesc =  sessionStorage.getItem("userNameDesc").trim();
	$("#wel-username").val(sessionStorage.getItem("wfm.menu.WELCOME") +": " + userNameDesc);

	$("#logout").click(function(){
		if(confirm(sessionStorage.getItem("wfm.confirm.logout"))){
			sessionStorage.clear();
			//$(this).attr("href","service/auth/login");
			$(this).attr("href","");
		}
	});
});
