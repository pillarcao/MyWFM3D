
// =============================================================================
//
// Class : WFMWFVIEWEQPT
//
// =============================================================================
// -----------------------------------------------------------------------------
// Constructor
// -----------------------------------------------------------------------------
/**
 * @class
 * @classdesc WFMWFVIEWEQPTクラス
 * @constructor
 */
function WFMWFVIEWEQPT() {
	// -------------------------------------------------------------------------
	// Instance Member
	// -------------------------------------------------------------------------
	/**
	 * TAB_INDEX_
	 * 
	 * @private
	 */
	this.TAB_INDEX_ = {
		"inprlist": 0,
		"waitlist": 1,
		"alarmlist": 2,
		"stocklist": 3,
	};

	/**
	 * INDEX_TAB_
	 * 
	 * @private
	 */
	this.INDEX_TAB_ = {
		0: "inprlist",
		1: "waitlist",
		2: "alarmlist",
		3: "stocklist",
	};

	this.LIST_MIN_ROWS_ = 10;

	this.contents_;

	this.hotGrid_;

	this.eqptid_;

	this.activeIndex_;

	// -------------------------------------------------------------------------
	// Process
	// -------------------------------------------------------------------------
	var inst = this;

	var hash = Util.getUrlHash(location.href);
	this.eqptid_ = hash.eqptid;

	this.activeIndex_ = this.TAB_INDEX_[hash.tab];

	this.contents_ = $("#contents").innerHTML;
	$("#contents").empty();

	var actIndex = this.TAB_INDEX_[hash.tab];
	Form.cursorWait(function() {
		inst.onSelectTabSub(actIndex);
	});

}

// -----------------------------------------------------------------------------
// Class Member
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Class Method
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Instance Property
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Instance Method
// -----------------------------------------------------------------------------
/**
 * @private
 */
WFMWFVIEWEQPT.prototype.getNewSize = function() {

	var inst = this;

	var $grid = $("#list");
	var $tab = $("#tab-" + inst.INDEX_TAB_[inst.activeIndex_]);
	var $stat = $("#group-stat");

	var statBottom = $stat.offset().top + parseInt($stat.css("height"));
	var tabWidth = parseInt($tab.css("width"));
	var tabHeight = parseInt($tab.css("height"));
	var tabBottom = statBottom + (Util.isNaN(tabHeight) ? 0 : tabHeight);

	var gridHeight = parseInt($grid.css("height")) + ($(window).height() - tabBottom) + 80;

	return {
		width: tabWidth,
		height: gridHeight,
	};

};

/**
 * @private
 */
WFMWFVIEWEQPT.prototype.resizeGrid = function() {

	var inst = this;

	var newSize = this.getNewSize();

	if (inst.hotGrid_) {
		inst.hotGrid_.updateSettings({
			width: newSize.width,
			height: newSize.height,
		});
		inst.hotGrid_.render();
	}

};

/**
 * @private
 * @param {WFMWFVIEWEQPT}
 *            inst
 * @param {object}
 *            event
 * @param {object}
 *            ui
 */
WFMWFVIEWEQPT.prototype.onSelectTab = function(inst, event, ui) {

};

/**
 * @private
 * @param {WFMWFVIEWEQPT}
 *            inst
 * @param {object}
 *            event
 * @param {object}
 *            ui
 */
WFMWFVIEWEQPT.prototype.onSelectTabSub = function(index) {

	var inst = this;

	var hash = Util.getUrlHash(location.href);
	var actIndex = index;
	var actTab = this.INDEX_TAB_[actIndex];

	// URLの更新
	hash.tab = actTab;

	if (index === 0) {

		// 
		inst.subRefreshInprList();

	} else if (index === 1) {

		inst.subRefreshWaitList();

	} else if (index === 2) {

		inst.subRefreshAlarmList();

	}

	Util.async(function() {
		inst.resizeGrid();
	}, 100);

};

/**
 * @private
 * @param {object}
 *            event
 * @param {object}
 *            ui
 */
WFMWFVIEWEQPT.prototype.subRefreshInprList = function() {

    
    $('#showTitle').html("Processing Lot List");
    
	this.subSetEqptInfo();

	// Grid
	var data = [];
	var newSize = this.getNewSize();
	$.ajax({
		url: "api/listInprLotByEqp",
		type: 'POST',
		data: { eqpId: this.eqptid_ },
		success: function(rtn) {
			data = JSON.parse(rtn);
			// console.log(data);
			var grid = document.getElementById('list');
			this.hotGrid_ = new Handsontable(grid, {
				// 列
				colHeaders: ["Eqp ID","SubLot ID", "Wafer Quantity", "Carrier ID", "Port ID", "Operation Start Time", "Operator ID",],
				columns: [
                {
                	data: "eqpId",
                	readOnly: true,
                	className: "htCenter htMiddle"
                },
				{
					data: "subLotId",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "curSublotWafCnt",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "carId",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "opeStartPortId",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "opeStartDttm",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "opeStartUserId",
					readOnly: true,
					className: "htCenter htMiddle"
				}],

				// 行
				maxRows: data.length,

				// データ
				data: data,

				// サイズ
				height: newSize.height,
				width: newSize.width,
				stretchH: "all",
			});
		}
	});
	
};

/**
 * @private
 * @param {object}
 *            event
 * @param {object}
 *            ui
 */
WFMWFVIEWEQPT.prototype.subRefreshWaitList = function() {

	// Eqpt Info
    $('#showTitle').html("Reserved Lot List");
	this.subSetEqptInfo();

	// Grid
	var data = [];
	var newSize = this.getNewSize();
	var grid = document.getElementById('list');
	
	$.ajax({
		url: "api/listWipByEqp",
		type: 'POST',
		data: { eqpId: this.eqptid_ },
		success: function(rtn) {
			data = JSON.parse(rtn);
			this.hotGrid_ = new Handsontable(grid, {
				// 列
				colHeaders: ["Eqp ID","Sublot ID", "Wafer Quantity", "Carrier ID", "Status","Ope ID"],
				columns: [
                {
                	data: "eqpId",
                	readOnly: true,
                	className: "htCenter htMiddle"
                },
				{
					data: "subLotId",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "curSublotWafCnt",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "carId",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "subLotStat",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "opeName",
					readOnly: true,
					className: "htCenter htMiddle"
				}],

				// 行
				maxRows: data.length,

				// データ
				data: data,

				// サイズ
				height: newSize.height,
				width: newSize.width,
				stretchH: "all",

			});
		}
	});	
	
};

/**
 * @private
 * @param {object}
 *            event
 * @param {object}
 *            ui
 */
WFMWFVIEWEQPT.prototype.subRefreshAlarmList = function() {

	// Eqpt Info
    $('#showTitle').html("Warning List");
	this.subSetEqptInfo();

	// Grid
	var data = [];
	var newSize = this.getNewSize();
	var grid = document.getElementById('list');
	$.ajax({
		url: "api/listAlarmHis",
		type: 'POST',
		data: { eqpId: this.eqptid_ },
		success: function(rtn) {
			data = JSON.parse(rtn);
			this.hotGrid_ = new Handsontable(grid, {
				// 列
				colHeaders: ["Eqp ID","Alarm ID", "Alarm Code", "Set/Reset", "Alarm Time", "Alarm Detail"],
				columns: [
				{
                	data: "eqpId",
                	readOnly: true,
                	className: "htCenter htMiddle"
                },
				{
					data: "almId",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "almCode",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "almStat",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "almDttm",
					readOnly: true,
					className: "htCenter htMiddle"
				}, {
					data: "almText",
					readOnly: true,
				}],

				// 行
				maxRows: data.length,

				// データ
				data: data,

				// サイズ
				height: newSize.height,
				width: newSize.width,
				stretchH: "all",

			});
		}
	});	

};


/**
 * STK Information
 */
WFMWFVIEWEQPT.prototype.STKInformationList = function() {
	// log.called();

	var inst = this;

	// Eqpt Info
//	var tx003 = new FlatTx(TxDef.TX003_NO_OARY);
//	tx003.i.eqp_id = this.eqptid_;

//	tx003.send();

//	if (!this.checkError_(tx003.txid, tx003.o.retcode1)) {
//		return;
//	}

//	this.subSetEqptInfo(tx003.o);

	// Grid

	var txstk = new FlatTx(TxDef.TXSTK);
	txstk.i.eqp_id = this.eqptid_;

	txstk.send();

	// L0.01 if (!this.checkError_(tx002.txid, tx002.o.retcode1)) {
	// L0.01 return;
	// L0.01 }
	this.subSetSTKInfo(txstk.o);
	var data = [];
	var arycnt = Math.min(Util.toInt(txstk.o.arycnt1), TxDef.TXSTK.outtx.type.ary1.len);

	for (var ix = 0; ix < arycnt || ix < this.LIST_MIN_ROWS_; ix++) {
		var oary = txstk.o.ary1[ix];

		data.push(oary);
	}

	var newSize = this.getNewSize();
	var grid = document.getElementById('list');
	this.hotGrid_ = new Handsontable(grid, {
		// 列
		colHeaders: ["stk_id", "car_id ", "carg_id", "empty_flg", "sublot_id", "sublot_id2 ", "sublot_id3 ", "tran_stat ", "location ", "carstats ", "car_use_last_dttm "],
		columns: [{
			data: "stk_id",
			readOnly: true,
		}, {
			data: "car_id",
			readOnly: true,
		}, {
			data: "carg_id",
			readOnly: true,
		}, {
			data: "empty_flg",
			readOnly: true,
		}, {
			data: "sublot_id",
			readOnly: true,
		}, {
			data: "sublot_id2",
			readOnly: true,
		}, {
			data: "sublot_id3",
			readOnly: true,
		}, {
			data: "tran_stat",
			readOnly: true,
		}, {
			data: "location",
			readOnly: true,
		}, {
			data: "carstats",
			readOnly: true,
		}, {
			data: "car_use_last_dttm",
			readOnly: true,
		}],

		// 行
		maxRows: data.length,

		// データ
		data: data,

		// サイズ
		height: newSize.height,
		width: newSize.width,
		stretchH: "all",

	});

};

WFMWFVIEWEQPT.prototype.subSetSTKInfo = function(txstko) {

	var elems = ["eqp_id", "eqp_name", "eqp_mode", "recip_id", "eqp_stat", ];
	var elemsstk = ["eqp_id", "eqp_name", "stk_stat", "total_carrier", "stock_in", ];
	for ( var ix in elems) {
		var elem = elems[ix];
		for ( var ix in elemsstk) {
			var elemstk = elemsstk[ix];
			if(elem=="eqp_mode" && elemstk=="stk_stat"){
				$("#" + elem).text('NULL');
			}
			if(elem=="eqp_id" && elemstk=="eqp_id"){
				$("#" + elem).text(txstko[elemstk]);
			}
			if(elem=="recip_id" && elemstk=="total_carrier"){
				$("#" + elem).text(txstko[elemstk]);
			}
			if(elem=="eqp_stat" && elemstk=="stk_stat"){
				$("#" + elem).text(txstko[elemstk]);
			}
			if(elem=="recip_id" && elemstk=="total_carrier"){
				$("#" + elem).text(txstko[elemstk]);
			}
			if(elem=="eqp_name" && elemstk=="eqp_id"){
				$("#" + elem).text(txstko[elemstk]);
			}
			//$("#" + elem).text(txstko[elemstk]);
		}				
		//$("#" + elem).text(txstko[elem]);
	}

};
/**
 * 装置情報詳細 共通部分の情報設定をします。
 * 
 * @private
 * @param {object}
 *            event
 * @param {object}
 *            ui
 */
WFMWFVIEWEQPT.prototype.subSetEqptInfo = function() {

//	var elems = ["eqp_id", "eqp_name", "eqp_mode", "recip_id", "eqp_stat", ];
	$.ajax({
		url : "api/getEqpInfor",
		type : 'POST',
		data:{eqpId: this.eqptid_},
		success : function(data) {
		    $("#eqp_id").text(data.eqpId);
		    $("#eqp_name").text(data.eqpName);
		    $("#eqp_mode").text(data.eqpMode);
		    $("#recip_id").text(data.recipId);
		    $("#eqp_stat").text(data.e10State);   
		}});
};

/**
 * 装置情報詳細 共通部分の情報設定をします。
 * 
 * @private
 * @param {object}
 *            event
 * @param {object}
 *            ui
 */
WFMWFVIEWEQPT.prototype.checkError_ = function(txid, retcode) {

	var msg = "";

	if (Util.toInt(retcode) === 0) {
		return true;
	}

	// error

	window.alert( //
	"FlatTx ID : " + txid + "\n" + //
	"エラーコード : " + retcode //
	);

	return false;
};

// -----------------------------------------------------------------------------

// =============================================================================
//
// Main
//
// =============================================================================

new WFMWFVIEWEQPT();

// =============================================================================
