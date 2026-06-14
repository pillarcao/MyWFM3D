
var currentGroupId = "";
var currentUserId = sessionStorage.getItem("currentUserId");
if( currentUserId == ""){
	currentUserId = 'admin';
}

var g_pickerItemList = [];

var g_groupDatas = [];

$(function() {
	//privilege check
	let temp=sessionStorage.getItem("userPrivilege");
	let arr_temp=temp.split(",");
	let privilege = [];
	for(let i=0; i<arr_temp.length;i++){
		privilege.push(arr_temp[i]);
	}

	// if(privilege.indexOf('COLRDEFW') < 0){
	// 	document.getElementById('submit').disabled=true;
	// }

	$("#active_menu").val("COLOR_DEF");
	$("#active_page").val("COLOR_DEF");
	

	g_groupDatas = [];
	g_groupDatas.push({
		groupList:'grouplist_eqp',
		categoryId:'eqp',
		eleDataMaps: [], // g_eleDataMaps_eqp,
		bgCategory:'COLOR_EQP_STATE_BG',
		fgCategory:'COLOR_EQP_STATE_FG',
	});
	// g_groupDatas.push({
	// 	groupList:'grouplist_chamber',
	// 	categoryId:'chamber',
	// 	eleDataMaps: [], // g_eleDataMaps_ch,
	// 	bgCategory:'COLOR_CHAMBER_STATE_BG',
	// 	fgCategory:null,
	// });
	g_groupDatas.push({
		groupList:'grouplist_port',
		categoryId:'port',
		eleDataMaps: [],  // g_eleDataMaps_port,
		bgCategory:'COLOR_EQP_PORT_STATE_BG',
		fgCategory:null,
	});
	g_groupDatas.push({
		groupList:'grouplist_eqpMode',
		categoryId:'eqpMode',
		eleDataMaps: [], // g_eleDataMaps_mode,
		bgCategory:'COLOR_EQP_MODE',
		fgCategory:null,
	});
	g_groupDatas.push({
		groupList:'grouplist_vehicleState',
		categoryId:'vehicleState',
		eleDataMaps: [], //
		bgCategory:'COLOR_VHC_STATE_BG',
		fgCategory:null
	});
	$.refulsh();

	/**
	 * 鼠标点击颜色选择框以外的位置. 颜色选择框自动隐藏. 
	 */
	 $(document).bind("click",function(e){ 
		try{
			var target = $(e.target); 
			if( target[0].id != null && !target[0].id.startsWith("picker_")){
				if( ! g_pickerItemList.includes(target[0].id)){
					if( $("#picker_colorpanel") != null){
						$("#picker_colorpanel").hide();
					}
				}
			}

		}catch (e){

		}
	});


	$.each(g_groupDatas,function(index, groupData) {
		var categoryId = groupData.categoryId;
		$("#refreshBtn_" + categoryId).on('click',function(){
			$.refreshAll('grouplist_' + categoryId);
		});

		$("#resetToDefaultBtn_" + categoryId).on('click',function(){
			$.resetAllToDefault('grouplist_' + categoryId);
		});
	
		$("#confirmBtn_" + categoryId ).on('click',function(){
			$.confirm('grouplist_' + categoryId);
		});

		if(privilege.indexOf('COLRDEFW') < 0){
			// document.getElementById('confirmBtn_' + categoryId ).disabled=true;
			// document.getElementById('resetToDefaultBtn_' + categoryId ).disabled=true;
		}
	});
	
});


function tesetBindColorpicker()
{
	$("#EQP_STATE_BG_DWT").val("#FF0000");
	$("#EQP_STATE_BG_DWT").colorpicker({
		fillcolor:true,
		success:function(o,color){
			$('#td_EQP_STATE_DWT').css("background-color", color);
		},
		defaultColor:'#00FF00',
		reset:function(o){
			$('#td_EQP_STATE_DWT').css("background-color", '#0000FF');
		}
	});

	$("#EQP_STATE_FG_DWT").val("#FF0000");
	$("#EQP_STATE_FG_DWT").colorpicker({
		fillcolor:true,
		success:function(o,color){
			$(o).css("color",color);
			$('#td_EQP_STATE_DWT').css("color", color);
		},
		defaultColor:'#FF0000',
		reset:function(o){
			$("#color").val('#0000FF');
		}
	});

	g_pickerItemList.push('EQP_STATE_FG_DWT');
	g_pickerItemList.push('EQP_STATE_BG_DWT');

	$(document).bind("click",function(e){ 
		try{
			var target = $(e.target); 
			if( target[0].id != null && !target[0].id.startsWith("picker_")){
				if( ! g_pickerItemList.includes(target[0].id)){
					if( $("#picker_colorpanel") != null){
						$("#picker_colorpanel").hide();
					}
				}
			}

		}catch (e){

		}
	});

// return;
}


$.extend(
{
	'refulsh':function(){
		g_pickerItemList.splice(0,g_pickerItemList.length + 1 );

		callAjaxRequest('listColorDefs', 'post', {},  function(data){ 
			// $.drawUi("grouplist_eqp",         'EQP',     g_eleDataMaps_eqp,  data, 'COLOR_EQP_STATE_BG',    'COLOR_EQP_STATE_FG');
			// $.drawUi('grouplist_eqpCategory', 'CATEGORY',g_eleDataMaps_category,   data, 'COLOR_EQP_CATEGORY');
			// $.drawUi('grouplist_chamber',     'CHAMBER', g_eleDataMaps_ch,   data, 'COLOR_CHAMBER_STATE_BG');
			// $.drawUi('grouplist_port',        'PORT',    g_eleDataMaps_port, data, 'COLOR_EQP_PORT_STATE_BG');

			for(var j = 0; j < g_groupDatas.length; ++j){
				var groupData = g_groupDatas[j];
				groupData.eleDataMaps.splice(0, groupData.eleDataMaps.length + 1 );
				$.drawUi(groupData.groupList, groupData.categoryId, groupData.eleDataMaps, data, groupData.bgCategory, groupData.fgCategory);
			}
			$('#div_colorDefineRow').show();
		 });
	},

	'drawUi':function(groupList, categoryId, eleDataMaps, dataList, bgCategory, fgCategory ){
		var html = "";
		$('#' + groupList ).children("tbody").empty();
		$('#' + groupList).DataTable().clear();
		$('#' + groupList).DataTable().destroy();

		var cssActOn = 'background-color';
		var labelWidth = '110px';
		if( bgCategory == 'COLOR_EQP_CATEGORY'){
			labelWidth = '150px';
			cssActOn = 'border-color';
		}
		if( bgCategory == 'COLOR_EQP_PORT_STATE_BG'){
			labelWidth = '110px';
		}

		// css('border', 'solid 2px red');

		$.each(dataList,function(index, colorDef) {
			if( colorDef.category == bgCategory){
				var id = categoryId + '_' + bgCategory + '_' + colorDef.item.replaceAll(' ', '').replaceAll('.', '_');
				html += '<tr>';
				// html += '<td id="td_'+id+'" style="padding-bottom: 0px;" ><label for="'+id+'" style="width:80px !important;padding-top: 8px; padding-bottom: 0px;"  >'+colorDef.item+'</label> </td> ';
				// html += '<td> \
				// 			<input id="'+id+'" type="text" name="'+id+'" \
				// 			class="form-control" placeholder="" style="width: 100px; padding-bottom: 0px;"> \
				// 		</td>';

				html += '<td style="padding-bottom: 2px; padding-top: 2px;" >\
					<div id="td_'+id+'" style="padding-top: 4px; padding-bottom: 0px; "  > \
					<label for="'+id+'" style="width:'+labelWidth+' !important;padding-top: 3px; padding-bottom: 0px; overflow: hidden; \
					  text-overflow:ellipsis; -o-text-overflow: ellipsis;"  >'
					+colorDef.item+'</label> <div> </td> ';
				html += '<td style="padding-bottom: 2px; padding-top: 2px; " align="center"> \
							<input id="'+id+'" type="text" name="'+id+'" \
							class="form-control" placeholder="" style="width: 95px; padding-bottom: 0px;"> \
						</td>';
				
				if(!g_pickerItemList.includes(id)){
					g_pickerItemList.push(id);
				}		
				var eleData = {
					id: id, 
					targetEle: 'td_' + id,         // 目标元素.
					cssActOn: cssActOn,  // CSS 作用于: 背景色.
					color: colorDef.color,
					newColor: colorDef.color,
					colorDef:colorDef,
					defaultColor: colorDef.defaultColor,
					
					category: colorDef.category,
					item: colorDef.item,
					extField: colorDef.extField,
					showOrder: colorDef.showOrder,
					subData: null,   // 字段颜色.
				};

				var subData = null;
				if( fgCategory != null && fgCategory != ''){
					for(var i = 0; i < dataList.length; ++i)
					{
						var colorDef2 = dataList[i];
						if( colorDef2.category == fgCategory && colorDef2.item == colorDef.item){
							var id2 = categoryId + '_' + fgCategory + '_' + colorDef2.item.replaceAll(' ', '').replaceAll('.', '_');
							html += ' <td style="padding-bottom: 2px; padding-top: 2px;" align="center">\
										<input id="'+id2+'" type="text" name="'+id2+'"\
										class="form-control" placeholder="" style="width: 95px; padding-bottom: 0px;"> \
									 </td>';
							if(!g_pickerItemList.includes(id2)){		 
								g_pickerItemList.push(id2);
							}
							subData = {
								id: id2, 
								targetEle: 'td_' + id,         // 目标元素.
								cssActOn: 'color',             // CSS 作用于: 前景色.
								color: colorDef2.color,         // 颜色
								newColor: colorDef2.color,      // 修改后的颜色. 
								colorDef:colorDef2,
								defaultColor: colorDef2.defaultColor,
								category: colorDef2.category,
								item: colorDef2.item,
								extField: colorDef2.extField,
								showOrder: colorDef2.showOrder,
								subData: null, 
							};
							break;		 
						}
					};
					if( subData != null){
						eleData.subData = subData;
						eleDataMaps.push(subData);
					}
				}

				eleDataMaps.push(eleData);
	
				// html += '<td style="padding-bottom: 2px; padding-top: 2px; " align="center"> \
				// 			<button id="resetBtn_'+id+'" type="button" class="btn btn-primary">复原</button> \
				// 		</td>';
				// html += '<td style="padding-bottom: 2px; padding-top: 2px; " align="center"> \
				// 		<button id="resetToDefaultBtn_'+id+'" type="button" class="btn btn-warning">还原为默认值</button> \
				// 		</td>';

				html += '</tr>';
			}
		});

		$('#' + groupList ).children("tbody").append(html);

		$.each(eleDataMaps, function(index3, eleData) {
			$("#" + eleData.id).val("" + eleData.newColor);

			$("#" + eleData.id ).colorpicker({
				fillcolor:true,
				success:function(o,color){
					$.updateColor(eleData, color);
				},
				defaultColor: eleData.newColor ,
				reset:function(o){
					$.updateColor(eleData, eleData.color);
				}
			});

			if( bgCategory == 'COLOR_EQP_MODE'){
				$('#' + eleData.targetEle).css('border', 'solid 3px #fff');
				// css('border', 'solid 2px red');
			}

			$('#' + eleData.targetEle).css(eleData.cssActOn, eleData.newColor);

			$('#' + eleData.id ).bind('keypress',function(event){
				if(event.keyCode == "13") {
					try {
						var colorId = $('#' + eleData.id ).val().toUpperCase().trim();
						var isVaild = false;
						if(colorId.startsWith('#') && colorId.length == 7 ){
							var isHex = true;
							for(var i = 1; i < colorId.length; ++i){
								var ch = colorId[i];
								if( !((ch >= 'A' && ch <='F' ) || (ch >= '0' && ch <='9' )) ){
									isHex = false;
								}
							}
							if( isHex){
								isVaild = true;
							}
						}

						if( isVaild ){
							$.updateColor(eleData, colorId);
						}else{
							alert(sessionStorage.getItem("wfm.incorrect.input"));
							$('#' + eleData.id ).val(eleData.newColor);
						}

						$("#picker_colorpanel").hide();
						
					} catch (error) {
					}
				}
			});

			$('#' + eleData.id ).blur(function(){
				$('#' + eleData.id ).val(eleData.newColor);;
			});

			// $("#resetBtn_" + eleData.id ).on('click',function(){
			// 	$.reset(eleData);
			// 	if( eleData.subData != null){
			// 		$.reset(eleData.subData);
			// 	}
			// });

			// $("#resetToDefaultBtn_" + eleData.id ).on('click',function(){
			// 	$.resetToDefault(eleData);
			// 	if( eleData.subData != null){
			// 		$.resetToDefault(eleData.subData);
			// 	}
			// });


		});
	},

	'updateColor':function(eleData, color){
		eleData.newColor = color;
		$('#' + eleData.targetEle).css(eleData.cssActOn, eleData.newColor);
		$("#" + eleData.id).val("" + eleData.newColor);
		
		if( eleData.newColor != eleData.color){
			$("#" + eleData.id).css('background-color', '#FFFACD');
		}else{
			$("#" + eleData.id).css('background-color', '#FFF');
		}

	},

	'reset':function(eleData){
		$.updateColor(eleData, eleData.color);
	},

	'resetToDefault':function(eleData){
		$.updateColor(eleData, eleData.defaultColor);
	},


	'getGroupData':function(groupListId){
		var groupData = null;
		for(var j = 0; j < g_groupDatas.length; ++j){
			groupData = g_groupDatas[j];
			if( groupData.groupList == groupListId){
				break;
			}
		}
		return groupData;
	},

	
	'resetAllToDefault':function(groupListId){
		var groupData = $.getGroupData(groupListId);
		if(groupData == null){
			// alert("groupListId 错误, 请联系管理员");
			return null;
		}

		for(var j = 0; j < groupData.eleDataMaps.length; ++j){
			var eleDataMap = groupData.eleDataMaps[j];
			$.updateColor(eleDataMap, eleDataMap.defaultColor);
		}

	},

	'refreshAll':function(groupListId){
		var groupData = $.getGroupData(groupListId);
		if(groupData == null){
			// alert("groupListId 错误, 请联系管理员");
			return null;
		}

		groupData.eleDataMaps.splice(0,groupData.eleDataMaps.length + 1 );

		callAjaxRequest('listColorDefs', 'post', {},  function(data){ 
				$.drawUi(groupData.groupList, groupData.categoryId, groupData.eleDataMaps, data, 
					groupData.bgCategory, groupData.fgCategory);
		 });
	},
	
	'confirm':function(groupListId){
		var groupData = $.getGroupData(groupListId);
		if(groupData == null){
			// alert("groupListId 错误, 请联系管理员");
			return null;
		}

		var dataList = [];
		for(var j = 0; j < groupData.eleDataMaps.length; ++j){
			var eleDataMap = groupData.eleDataMaps[j];
			if( eleDataMap.color != eleDataMap.newColor){
				dataList.push(eleDataMap.category);         // 0 
				dataList.push(eleDataMap.item);             // 1 
				dataList.push(eleDataMap.newColor);         // 2

				dataList.push(eleDataMap.showOrder);        // 3 
				dataList.push(eleDataMap.extField);         // 4 
				dataList.push(eleDataMap.defaultColor);     // 5 

			}
		}

		if(dataList.length > 0 ){
			if( !confirm(sessionStorage.getItem("wfm.confirm.update"))){
				return;
			}
			$.submit(dataList, groupData);
			return;
		}else{
			// alert("没有更新的项目");
		}

		groupData.eleDataMaps.splice(0, groupData.eleDataMaps.length + 1 );

		callAjaxRequest('listColorDefs', 'post', {},  function(data){ 
				$.drawUi(groupData.groupList, groupData.categoryId, groupData.eleDataMaps, data, 
					groupData.bgCategory, groupData.fgCategory);
		 });
		
	},

	'submit':function(dataList, groupData){

        //// JSON.stringify({items:dataList}) 
		callAjaxRequest('updateColorDefs', 'post', {items:dataList},  function(data){ 
			// console.log("updateColorDefs:  result = " + data);
			if( data > 0){
				alert(sessionStorage.getItem("wfm.update.succeeded"));
			}

			groupData.eleDataMaps.splice(0, groupData.eleDataMaps.length + 1 );
			callAjaxRequest('listColorDefs', 'post', {},  function(data){ 
					$.drawUi(groupData.groupList, groupData.categoryId, groupData.eleDataMaps, data, 
						groupData.bgCategory, groupData.fgCategory);
			 });

		 });

	},


});

