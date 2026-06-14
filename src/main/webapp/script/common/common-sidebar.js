$(function(){
	// var tokenString = "&token="+sessionStorage.getItem("token");
	$.ajax({
		url: "api/getuserprivilegebyuserid",
		type: "POST",
		beforeSend:function(request) {
			request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
		success:function(data2) {
			var privileges=[];
			$.each(data2,function(index, item) {
				//alert(item.functionId + "-" + item.permission);
				privileges.push(item.functionId,item.permission);
			});
			if(privileges.length>0) {
				sessionStorage.setItem("userPrivilege",privileges.toString());
			}
			$.ajax({
				url: "api/menus",
				type: "GET",
				beforeSend:function(request) {
		            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
		        },
				success:function(data) {
					var html = '';
					var active_menu=$("#active_menu").val();
					//var active_type;
					var active_type = 'MENU';//设置默认值
					
					//点击左侧Tree，打开页面后, 左侧Tree保持原来的展开模式----Start
                    var rememberOpenNode = true;
                    var parentArray = new Array();
                    
                    if(rememberOpenNode) {
                        var parentId = active_menu;
                        for(var i = 0; i < data.length; i++) {
                            var item = data[i];
                            if((active_type == null) && (item.menuId.trim() == active_menu)) {
                                active_type = item.menuType;
                            }
                            if((item != null) && (item.menuId.trim() == parentId)) {
                                parentArray.push(item.menuId);
                                parentId = item.parentId;
                                break;
                            }
	                    }
                    }
                  //点击左侧Tree，打开页面后, 左侧Tree保持原来的展开模式----End
					for(var i = 0;i < data.length;i++){
						var item = data[i];
						if(privileges.indexOf(item.privid) >= 0) {//在SM里有设定相应权限，则加载Menu
							if(item.menuLvl != 1) continue;
							if(item.menuId.trim() == active_menu){
								active_type = item.menuType;
							}
							if(item.menuType == 'MENU'){
								html += ("<li id='"+item.menuId.trim()+"'><a href='"+item.href+sessionStorage.getItem("loginUrl")+"' ><i class='fa fa-link'></i> <span>"+$.translateMenu(item)+"</span></a></li>");
							} else if (item.menuType == 'TREE'){
								
								html += "<li id='"+item.menuId.trim()+"'class='treeview'> <a href='"+item.href+sessionStorage.getItem("loginUrl")+"'><i class='fa fa-plus-square'></i><span>"+$.translateMenu(item)+"</span> " +
								"<span class='pull-right-container'> <i class='fa fa-angle-left pull-right'></i></span> </a>";
								html += "<ul class='treeview-menu'>";
								$.each(data,function(index, subItem){
									if(subItem.parentId == item.menuId && subItem.menuType == 'MENU'){
										html += "<li><a href='"+subItem.href+sessionStorage.getItem("loginUrl")+"'><i class='fa fa-circle-o'></i>"+$.translateMenu(subItem)+"</a></li>";
									}else if(subItem.parentId == item.menuId && subItem.menuType == 'TREE'){
										var subMenus = [];
										subMenus.push(subItem);
										$.each(data,function(index, ssubItem){
											if(ssubItem.parentId == subItem.menuId){
												subMenus.push(ssubItem);
											}
										});
										html += $.initTree(data,subMenus,subItem);
									}
								});
								html += "</ul></li>";
							}
						}
						if(item.menuType == 'MENU' && item.menuId == 'WFMSERVERINFO'){
							html += ("<li id='"+item.menuId.trim()+"'><a href='"+item.href+sessionStorage.getItem("loginUrl")+"' ><i class='fa fa-link'></i> <span>"+$.translateMenu(item)+"</span></a></li>");
						}
					}
/*
					for (var i = 0; i < data.length; i++) {
                        var item = data[i]; // 解决 IE中 Tree 不能显示的问题. 
						if(item.menuLvl != 1) continue;
						if(item.menuId.trim() == active_menu){
							active_type = item.menuType;
						}
						if(item.menuType == 'MENU'){
							if( item.menuId == 'WELCOME' && privileges.length == 0 ){
								continue;
							}

							if (privileges.indexOf('COLRDEFR') < 0 && item.menuId=='COLOR_DEF')  continue; //set disabled
							if (privileges.indexOf('UPLDDEFR') < 0 && item.menuId=='SVG_UPLOAD')  continue; //set disabled

                            html += ("<li id='"+item.menuId.trim()+"'><a href='"+item.href+sessionStorage.getItem("loginUrl")
                                 + tokenString // +"&token="+sessionStorage.getItem("token")
                                + "'" +"><i class='fa fa-link'></i> <span>"+$.translateMenu(item)+"</span></a></li>");
						}else if(item.menuType == 'TREE'){

                            html += "<li id='"+item.menuId.trim()+"' class='treeview'> <a href='"+item.href+sessionStorage.getItem("loginUrl")
                                + tokenString // +"&token="+sessionStorage.getItem("token")
                                +"'" +"><i class='fa fa-plus-square'></i><span>"+$.translateMenu(item)+"</span> " +
								"<span class='pull-right-container'> <i class='fa fa-angle-left pull-right'></i></span> </a>";
							html += "<ul class='treeview-menu'>";
							$.each(data,function(index, subItem){
								if( subItem.menuId == 'WELCOME' && privileges.length == 0 ){
									return;
								}
								if (privileges.indexOf('COLRDEFR') < 0 && subItem.menuId=='COLOR_DEF')  return; //set disabled
								if (privileges.indexOf('UPLDDEFR') < 0 && subItem.menuId=='UPLOAD_SVG')  return; //set disabled
			
								if(subItem.parentId == item.menuId && subItem.menuType == 'MENU'){
                                    html += "<li id='"+subItem.menuId.trim()+"' ><a href='"+subItem.href+sessionStorage.getItem("loginUrl")
									    + tokenString // +"&token="+sessionStorage.getItem("token")
                                        +"'  onclick='checkRepeatClicks(this)' " +"><i class='fa fa-circle-o'></i>"+$.translateMenu(subItem)+"</a></li>";
								}else if(subItem.parentId == item.menuId && subItem.menuType == 'TREE'){
									var subMenus = [];
									subMenus.push(subItem);
									$.each(data,function(index, ssubItem){
										if (privileges.indexOf('EQPTDEFR') < 0 && ssubItem.menuId=='EQP_DEF')  return; //set disabled
										if (privileges.indexOf('EGRPDEFR') < 0 && ssubItem.menuId=='EQPG_DEF')  return; //set disabled
										if (privileges.indexOf('EGRPDEFR') < 0 && ssubItem.menuId=='EQPG_EQP_DEF')  return; //set disabled
										if (privileges.indexOf('USERDEFR') < 0 && ssubItem.menuId=='USER_DEF')  return; //set disabled
										if (privileges.indexOf('UGRPDEFR') < 0 && ssubItem.menuId=='GROUP_DEF')  return; //set disabled
										if (privileges.indexOf('UGRPDEFR') < 0 && ssubItem.menuId=='GROUP_USER')  return; //set disabled
										if(ssubItem.parentId == subItem.menuId){
											subMenus.push(ssubItem);
										}
									});
									html += $.initTree(data,subMenus,subItem);
								}
							});
							html += "</ul></li>";
						}
					}
*/
					$(".sidebar-menu").append(html);
					
					if(rememberOpenNode && parentArray.length > 0) {
                        parentArray.reverse();
                        for (var i = 0; i < parentArray.length - 1; ++i) {
                            $("#" + parentArray[i]).addClass("active");
                            $("#" + parentArray[i]).addClass("menu-open");
                        }
                    }
					
					if(active_type == 'TREE') {
						$("#"+active_menu).addClass("active");
						$("#"+active_menu).addClass("menu-open");
					} else if(active_type == 'MENU') {
						$("#"+active_menu).addClass("active");
					}
				}
			});
		}
	});
});

$.extend({'initTree':function(data,subMenus,currentMenu){
		var html = "<li id='"+currentMenu.menuId.trim()+"'class='treeview'> <a href='"+currentMenu.href+sessionStorage.getItem("loginUrl")+"'><i class='fa fa-plus-square'></i><span>"+$.translateMenu(currentMenu)+"</span> " +
			"<span class='pull-right-container'> <i class='fa fa-angle-left pull-right'></i></span> </a>";
		html += "<ul class='treeview-menu'>";
		for(var k = 0;k < subMenus.length;k++){
			var item = subMenus[k];
			if(item.menuId == currentMenu.menuId)
				continue;
			if(item.menuType == 'MENU'){
				html += "<li><a href='"+item.href+sessionStorage.getItem("loginUrl")+"'><i class='fa fa-circle-o'></i>"+$.translateMenu(item)+"</a></li>";
			}else if(item.menuType == 'TREE'){
				var subMenus = [];
				subMenus.push(item);
				$.each(data,function(index, subItem){
					if(subItem.parentId == item.menuId){
						subMenus.push(subItem);
					}
				});
				html += $.initTree(data,subMenus,item);
			}
		}
		html += "</ul></li>";
		return html;
	}
});

$.extend({'translateMenu':function(item){
	return sessionStorage.getItem("wfm.menu." + item.menuId);
}});