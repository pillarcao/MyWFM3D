/***
 *  author: zhuxiuhong
 *  date:   2020/07/28
 */
function  convertDateTime( dateTime)
{
	if(dateTime == null || dateTime == ""){
		return dateTime;
	}
	if(dateTime.length == 10){
		return dateTime;
	}
	
	return dateTime.replace(/ /ig,'-').replace(/:/ig,'.');
}

function  increaseDateTime( s_tmpDate)
{
	// 日期 加 1 
	var s_tmpDate2 = "";
	var addDate = false;
	if(  /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/.test(s_tmpDate)){
		addDate = true;
		s_tmpDate2 = s_tmpDate.substr(0,10).replace(/-/ig,'/');
	}else{
		//  获取 日期 和 时间 
		var d0 = s_tmpDate.substr(0,10).replace(/-/ig,'/');
		var t0 =s_tmpDate.substr(11,8).replace(/\./ig,':');
		s_tmpDate2 = d0 + " " + t0;
	}


		var tmpDate = new Date(s_tmpDate2);

		var y = tmpDate.getFullYear();
		var m = tmpDate.getMonth() + 1;
		var d = tmpDate.getDate();
		
		var HH = tmpDate.getHours();
		var MM = tmpDate.getMinutes();
		var SS = tmpDate.getSeconds();

		if(addDate ){
			d += 1;   // 加 1 天
		}else{
			SS += 1;  // 加 1 秒. 
		}

		// var newDate0 = "" + y + "-" + m + "-" + d + " " + HH + ":" + MM + ":" + SS;
		// tmpDate = new Date(newDate0);
		
		tmpDate.setDate(d);
		tmpDate.setSeconds(SS);

		HH = tmpDate.getHours();
		MM = tmpDate.getMinutes();
		SS = tmpDate.getSeconds();

		y = tmpDate.getFullYear();
		m = tmpDate.getMonth() + 1;
		d = tmpDate.getDate();
		
		var dateTime2 = tmpDate.getFullYear() + "-" + (m<10?("0"+m):m) + "-" + (d<10?("0"+d):d);
		// if( HH > 0 || MM > 0 || SS > 0)
		{
			dateTime2+= " " + (HH < 10?("0"+HH):HH) + ":" + (MM < 10?("0"+MM):MM) + ":" + (SS < 10?("0"+SS):SS) +".000000";
			// dateTime2+= " " + (HH < 10?("0"+HH):HH) + ":" + (MM < 10?("0"+MM):MM) + ":" + (SS < 10?("0"+SS):SS) +".827010";
		}


		return	dateTime2.replace(/ /ig,'-').replace(/:/ig,'.');	

	

	return s_tmpDate ;

}
function  verifyDateTimeFormat( dateTime)
{
	if(dateTime == null || dateTime.trim() == "" ){
		return true;
	} 

	var s_tmpDate = dateTime.trim();
	if(  /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/.test(s_tmpDate)){
		try {
			s_tmpDate = s_tmpDate.substr(0,10).replace(/-/ig,'/');
			var tmpDate = new Date(s_tmpDate);
			if(tmpDate == null || tmpDate == "Invalid Date"){
				return false;
			}
			var s_tmpDate2 = tmpDate.getFullYear() + "/" 
				+ ((tmpDate.getMonth() + 1) < 10 ? ("0" +  (tmpDate.getMonth() + 1))  :  (tmpDate.getMonth() + 1) )
				+ "/" 
				+ (tmpDate.getDate() < 10 ?("0" + tmpDate.getDate()) : tmpDate.getDate());
			if( s_tmpDate != s_tmpDate2 ){
				return false;
			}

		} catch (error) {
			return false;
		}
		return true;
	}

	var DATE_FORMAT_Array = new Array();
	DATE_FORMAT_Array.push( /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1} [0-2]?[0-9]{1}:[0-5]?[0-9]{1}:[0-5]?[0-9]{1}.[0-9]{0,7}$/ );
	DATE_FORMAT_Array.push( /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}-[0-2]?[0-9]{1}.[0-5]?[0-9]{1}.[0-5]?[0-9]{1}.[0-9]{0,7}$/ );
	
	// 2020-08-28 11:10
	DATE_FORMAT_Array.push( /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1} [0-2]?[0-9]{1}:[0-5]?[0-9]{1}:[0-5]?[0-9]{1}$/);
	DATE_FORMAT_Array.push( /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}-[0-2]?[0-9]{1}.[0-5]?[0-9]{1}.[0-5]?[0-9]{1}$/);
	
	var isValid  = false;

	$.each(DATE_FORMAT_Array,function(index, item) {
		if( item.test(s_tmpDate)){
			isValid = true;
		}
	});
    
	if(s_tmpDate.length > 19){
		var s0 = s_tmpDate.substr(19,1);
		if( s0 != '.'){
			return false;
		}
	}

	if( isValid){
		// "2020-07-27-13.54.18"
		var d0 = s_tmpDate.substr(0,10).replace(/-/ig,'/');
		var t0 =  s_tmpDate.substr(11,8).replace(/\./ig,':');
		s_tmpDate = d0 + " " + t0;			
	}else{
		// debugger;
		return false;
	}

	try {
		var s_tmpDate2 = s_tmpDate.substr(0,19).replace(/-/ig,'/');
		var tmpDate = new Date(s_tmpDate2);
		var arr1 = new Array();
		var y = tmpDate.getFullYear();
		var m = tmpDate.getMonth() + 1;
		var d = tmpDate.getDate();

		var HH = tmpDate.getHours();
		var MM = tmpDate.getMinutes();
		var SS = tmpDate.getSeconds();

		arr1.push(y);
		arr1.push(m);
		arr1.push(d);
		arr1.push(HH);
		arr1.push(MM);
		arr1.push(SS);

		var s_tmpDate3 = s_tmpDate2.replace(/ /ig,'/').replace(/:/ig,'/');
		var arr0 = new Array();
		arr0 = s_tmpDate3.split('/');
		for( var i = 0; i < arr0.length;  i ++){
			if( parseInt(arr0[i]) != arr1[i] ){
				debugger;
				return false;
			}
		}

	} catch (error) {
		debugger;
		return false;
	}
	return true;
}

// zhuxiuhong 2020/08/07 01:49
function isNotBlank(val)
{
	return  val != null && val != "null" && val != "" &&  val.trim() != "" ;
}

function href_page(apiUrl, searchKey, item, otherParam)
{
	var lang=sessionStorage.getItem("loginUrl");
	if(otherParam == null){
		otherParam = ""
	}
	// var token=sessionStorage.getItem("token");
	// '<a href="service/api/msg'+lang+'&msgId=' + item + "&token="+token + '" > ' + item +'</a>' 
	// return '<a href="service/api/'+apiUrl +lang+'&' + searchKey + '=' + item + "&token="+token + '" > ' + item +'</a>' 
	return '<a href="service/api/'+apiUrl +lang+'&' + searchKey + '=' + item + otherParam + '" > ' + item +'</a>' 
}


function selectAjaxRequest(apiUrl, data, selectId, getItemVal, getItemName )
{
    $.ajax({
		// async:ajax_async,
		url:"api/" + apiUrl,
		type:'GET',
		beforeSend: function(request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
		},
		data: data,
		success : function(data){
			// var id = "#msgId_search";
			selectId.empty();
			selectId.append("<option value=''>--Please Select--</option>");
			$.each(data,function(index, item){
				// $(id).append("<option value='" + item +"'>"+item + "</option>");
				selectId.append("<option value='" + getItemVal(item) +"'>" + getItemName( item ) + "</option>");
			});
			selectId.select2({width:'100%'});
		},
		error:function(jqXHR, textStatus, errorThrown){
			alert(jqXHR.responseText);
		}
	});
}


function callAjaxRequest(apiUrl, type, data, successCallback)
{
    $.ajax({
		url:"api/" + apiUrl,
		type: type,
		beforeSend: function(request) {
            request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
		},
		data: data,
		traditional: true,
		success : function(data){
			if( data != null && data.errorCode != null && data.errorCode != "" ){
				var msg = sessionStorage.getItem( data.errorCode );
				if(data.data != null && data.data != "" ){
					msg += "\n" + data.data ; // 
				}
				alert(msg);
				return;
			}

			if(successCallback != null){
				successCallback(data);
			}else{
				try {
					if( data.startsWith("wfm.")){
						alert(sessionStorage.getItem( data ));
					}
				} catch (error) {
				}
			}		
				
		},
		error:function(jqXHR, textStatus, errorThrown){
			alert(jqXHR.responseText);
		}
	});
}


function td_tableInputItem( width, val)
{
	if(val == null ){
		val = "";
	}else{
		val = val.replace(/"/g,'&quot;').replace(/'/g,'&apos;');
	}
	return "<td style='width: "+width+ ";min-width: "+width+ ";'>" 
			+ "<input type='text'  value='" + val +  "' style='width: 100%; border:0px;' readonly='readonly' οnfοcus='this.select()'> </input>"
			+ "</td>";
}

function td_tableHtmlItem( width, val)
{
	if(val == null ){
		val = "";
	}else{
		val = val.replace(/"/g,'&quot;').replace(/'/g,'&apos;');
	}
	return "<td style='width: "+width+ ";min-width: "+width+ ";'>" 
	        + val	
			// + "<input type='text'  value='" + val +  "' style='width: 100%; border:0px;' readonly='readonly' οnfοcus='this.select()'> </input>"
			+ "</td>";
}


function  init_dataTable4ServerSide(tableId, ajaxBody,  columns, showDetailFunc)
{
	var pageSize = $("select[name='" +tableId +"_length']").val();
	if( pageSize == null || pageSize == "" || pageSize <= 0){
		pageSize = 10;
	}

	$("#" + tableId).children("tbody").empty();
	$('#' + tableId).DataTable().clear();
	$('#' + tableId).DataTable().destroy();
	
	$("#" + tableId).dataTable(
		{
			processing: true,    // 是否显示处理状态(排序的时候，数据很多耗费时间长的话，也会显示这个)
			lengthChange: true,  // 是否允许用户改变表格每页显示的记录数
			orderMulti: false,   // 启用多列排序
			ordering: false,     // 使用排序
			bStateSave: false,   // 记录cookie
			paging: true,        // 是否分页
			pagingType: "full_numbers", // 除首页、上一页、下一页、末页四个按钮还有页数按钮
			lengthMenu: [10, 25, 50, 100, 200],
			pageLength: pageSize,
			searching: false,    // 是否开始本地搜索
			stateSave: false,    // 刷新时是否保存状态
			autoWidth: true,     // 自动计算宽度
			deferRender: true,   // 延迟渲染
			serverSide: true,    // 服务端分页
			ajax: ajaxBody,
			// {
			// 	url : "service/api/listAlmReceiveLog",
			// 	type : 'POST',
			// 	beforeSend: function(request) {
			// 		request.setRequestHeader("Authorization", sessionStorage.getItem("token"));
			// 	},
			// 	data:{'receiveDatetime':receiveDatetime,
			// 		'almId':almId,
			// 		'fabId':fabId,
			// 		'subsysCode':subsysCode,
			// 		'eqpId':eqpId,
			// 		'resultMsg':resultMsg,
			// 		'almTimestamp':almTimestamp,
			// 	},
			//   },
			  "columns": columns
			//   [ 
			// 	{
			// 		"class":          "details-control, checkboxFixedWidth",
			// 		"orderable":      false,
			// 		"data":           null,    
			// 		"defaultContent": "<input type='checkbox' class='minimal' />",
			// 	},
			// 	{ "data": "receiveDatetime" },
			// 	{ "data": "almId" },
			// 	{ "data": "fabId" },
			// 	{ "data": "subsysCode" },
			// 	{ "data": "eqpId" },
			// 	{ "data": "almSubject" },
			// 	{ "data": "almType" },
			// 	{ "data": "resultMsg" },
			// 	{ "data": "almTimestamp" },
			// 	{ "data": "almContent", "class": 'displayNone' },
			// ]
			,

			"fnPreDrawCallback": function( settings, json ) {
				$("#selectAll").prop("checked",false);
				$("#selectAll").parent().removeClass("checked").attr("aria-checked",false);
				$('#' + tableId + ' tbody tr').removeClass("info");
			},

			// "initComplete": function( settings, json ) {
			// },

			"drawCallback": function( settings, json ) {
				$('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
					checkboxClass: 'icheckbox_minimal-blue',
					radioClass   : 'iradio_minimal-blue'
				});

				$('#' + tableId + ' tbody tr').on('click',function(){
					$('#' + tableId + ' tbody tr').removeClass("active");
					$('#' + tableId + ' tbody tr').removeClass("info");
					$(this).addClass("info");
					
					showDetailFunc( $(this));

					// var almId =      $(this).children().eq("2").html();
					// var eqpId =      $(this).children().eq("5").html();
					// var almSubject = $(this).children().eq("6").html();
					// var almContent = $(this).children().eq("10").html();
					
					// $("#almId_detail").val(almId);
					// $("#eqpId_detail").val(eqpId);
					// $("#msgSubject_detail").val(almSubject);
					// $("#msgContent_detail").val(almContent);
					// $("#alarmResult_detail").html($(this).children().eq("8").html());
					// $("#msgContentView").show();
				});

				$("#" + tableId).on('page.dt',function (){
					$("#selectAll").prop("checked",false);
					$("#selectAll").parent().removeClass("checked").attr("aria-checked",false);
					$("#" + tableId + " tbody input[type='checkbox']").each(function(){
						$(this).prop("checked",false);
						$(this).parent().removeClass("checked").attr("aria-checked",false);
					});
				}).DataTable();

				$("#selectAll").prop("checked",false);
				$("#selectAll").parent().removeClass("checked").attr("aria-checked",false);

				$("#selectAll").siblings(":first").click(function(){
					$("#" + tableId + " tbody input[type='checkbox']").each(function(){
						$(this).prop("checked",false);
						$(this).parent().removeClass("checked").attr("aria-checked",false);
						$(this).prop("checked",$("#selectAll").prop("checked"));
						if($("#selectAll").prop("checked") == true){
							$(this).parent().addClass("checked").attr("aria-checked",true);
						}
					});
				});

            },
		}
	);


}





