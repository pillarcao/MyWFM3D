
var currentGroupId = "";
var currentUserId = sessionStorage.getItem("currentUserId");
if( currentUserId == ""){
	currentUserId = 'admin';
}

$(function() {
	//privilege check
	let temp=sessionStorage.getItem("userPrivilege");
	let arr_temp=temp.split(",");
	let privilege = [];
	for(let i=0; i<arr_temp.length;i++){
		privilege.push(arr_temp[i]);
	}

	if(privilege.indexOf('UPLDDEFW') < 0){
//		document.getElementById('svgFile').disabled=true;
//		document.getElementById('selectAll').disabled=true;
//		document.getElementById('uploadBtn').disabled=true;
//		document.getElementById('deleteBtn').disabled=true;
//		document.getElementById('setDefaultBtn').disabled=true;
	}

	$("#active_menu").val("SVG_UPLOAD");
	$("#active_page").val("SVG_UPLOAD");
	
	// var searchFlag = false;

	//  $(".select2").select2();
 
	$("#uploadBtn").on('click',function(){
		$.uploadFile();
	});
	$("#refreshBtn").on('click',function(){
		$.refresh();
	});

	$("#setDefaultBtn").on('click',function(){
		$.setFileInUse();
	});
	$("#downLoadBtn").on('click',function(){
		$.downloadFile();
	});
	$("#deleteBtn").on('click',function(){
		$.deleteFile();
	});

$.ajax({
        url: "api/listFloorDef",
        type: "POST",
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
        data: { },
        success: function (data) {
            $("#floorNoSelect").empty();
            $.each(data, function (index, item) {
                var floorId  = item.floorId.trim();
                var floorName  = item.floorName.trim();
                $("#floorNoSelect").append("<option value='" + floorId + "'>" + floorName + "</option>");
            });
        },
        error: function (e) {
            document.getElementById("floorNoSelect").options.length = 0;
            document.getElementById("floorNoSelect").options.add(new Option("loading failed", "loading failed"));
        }
    });
	
	$.refresh();
	
});

$.extend({'uploadFile':function(){
	if( document.getElementById('svgFile').files[0] == null){
		return;
	}
	var fileName = document.getElementById('svgFile').files[0].name;
	var length = fileName.length;
	for (var i = 0; i < length; i++) {
		if (fileName.charCodeAt(i) > 127) {
			length=length+2; 
		}
	}

	if( length >= 64){
		alert(sessionStorage.getItem( 'wfm.upload.filename.long' ));
		return; 
	}


	var formData = new FormData();
	formData.append('file', document.getElementById('svgFile').files[0]);
	formData.append('filePurpose', 'svgFile_FabView');
	formData.append('floorNo', $("#floorNoSelect").val());

	if(document.getElementById('svgFile').files[0].size > 20*1024*1024){ //20M
		alert(sessionStorage.getItem( 'wfm.upload.too.big' ));
		return;
	}

	$.ajax({
		url:"api/uploadSvgFile",
		type:'POST',
		beforeSend: function(request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
		},
		data: formData, 
		async: true,   
		processData: false,  
		contentType: false, 
		success : function(data){
			document.getElementById('uploadForm').reset();
			
			if( data != null && data.errorCode != null && data.errorCode != "" ){
				var msg = sessionStorage.getItem( data.errorCode );
				if(data.data != null && data.data != "" ){
					msg += "\n" + data.data ; // 
				}
				alert(msg);
				return;
			}
			var returnMsg = data;
			if( data.startsWith("wfm.")){
				returnMsg = sessionStorage.getItem( data );
			}			

			if(returnMsg != null && returnMsg != ""){
				alert(returnMsg);
			}
			$.refresh();

		},
		error:function(jqXHR, textStatus, errorThrown){
			alert(jqXHR.responseText);
		}
	});

},

'refresh':function(){
	$("#grouplist").children("tbody").empty();
	$("#selectAll").prop('checked',false);

	$.ajax({
		url : "api/listFiles",
		type : 'POST',
		beforeSend: function(request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
        },
		data:{filePurpose: 'svgFile_FabView'},
		success : function(data) {
			$("#grouplist").children("tbody").empty();
			$('#grouplist').DataTable().clear();
			$('#grouplist').DataTable().destroy();
			
			$.each(data,function(index, item) {
				$('#grouplist').children("tbody").append("<tr><td style='width:10px !important' ><input type='checkbox' class='minimal'/></td><td>"
								+ '<a href=\'javascript:window.location.href="api/downloadFile?fileMd5sum=' 
								+ item.fileMd5sum + '" \'> ' + item.fileName + '</a>'
														// + item.fileName
														+ "</td><td style='display: none;'>"
														+ item.floorNo
														+ "</td><td>"
                                                        + item.floorName
														+ "</td><td>"
														+ item.fileSize
														+ "</td><td>"
														+ item.inUse
														+ "</td><td>"
														+ item.fileMd5sum
														+ "</td><td>"
														+ item.lastUser
														+ "</td><td>"
														+ item.lastDatetime.substr(0,19)
														+ "</td></tr>" );
				
			});
			$('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
					checkboxClass: 'icheckbox_minimal-blue',
					radioClass   : 'iradio_minimal-blue'
			});

			$('#grouplist tbody tr').on('click',function(){

				$('#grouplist tbody tr').removeClass("active");
				$('#grouplist tbody tr').removeClass("info");
				$(this).addClass("info");
			});
			

			$('#grouplist').on('page.dt',function (){
				$("#selectAll").prop("checked",false);
				$("#selectAll").parent().removeClass("checked").attr("aria-checked",false);
				$("#grouplist tbody input[type='checkbox']").each(function(){
					$(this).prop("checked",false);
					$(this).parent().removeClass("checked").attr("aria-checked",false);
				});
			}).DataTable();
		
			$('#databox').show();
			
			//Select All
			$("#selectAll").siblings(":first").click(function(){
				$("#grouplist tbody input[type='checkbox']").each(function(){
					$(this).prop("checked",false);
					$(this).parent().removeClass("checked").attr("aria-checked",false);
					$(this).prop("checked",$("#selectAll").prop("checked"));
					if($("#selectAll").prop("checked") == true){
						$(this).parent().addClass("checked").attr("aria-checked",true);
					}
				});
			});

		}});
	}, 

	'deleteFile':function(){
		if( !confirm(sessionStorage.getItem("wfm.confirm.delete"))){
			return;
		}

		var vals=[];
		var ele = $("#grouplist tbody input[type='checkbox']:checked");
		if(ele.length == 0){
			alert(sessionStorage.getItem("wfm.delete.none.select.file"));
		}else{
			ele.each(function(){
				vals.push($(this).parent().parent().parent().children("td").eq("6").html().trim());
			});
			callAjaxRequest('deleteFiles', 'post', {md5sumArray:vals},  function(data){ 
				try { if( data.startsWith("wfm.")){ alert(sessionStorage.getItem( data )); } } catch (error) {}
				$.refresh();
			 } );
		}
		
	},


	'setFileInUse':function(){
		if( !confirm(sessionStorage.getItem("wfm.confirm.setDefault"))){
			return;
		}

		var vals=[];
		var ele = $("#grouplist tbody input[type='checkbox']:checked");
		if(ele.length == 0){
			alert(sessionStorage.getItem("wfm.confirm.select.none"));
		}else if( ele.length > 1) {
			alert(sessionStorage.getItem("wfm.confirm.select.one"));
		}else {
			ele.each(function(){
				vals.push($(this).parent().parent().parent().children("td").eq("6").html().trim());
				vals.push($(this).parent().parent().parent().children("td").eq("2").html().trim());
			});
			callAjaxRequest('setFileInUse', 'post', {md5sum:vals[0],floorNo:vals[1]},  function(data){
				try { if( data.startsWith("wfm.")){ alert(sessionStorage.getItem( data )); } } catch (error) {}
				$.refresh();
			 });
		}
	},


});
