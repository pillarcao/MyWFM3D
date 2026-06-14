// =============================================================================
//
// Class : Util
//
// $Date: 2017-07-06 11:46:41 +0900 (Thu, 06 Jul 2017) $
// $Rev: 99 $
//
// =============================================================================
/**
 * コンストラクタ
 * 
 * @classdesc ユーティリティクラスです。汎用的な機能を提供します。
 * @constructor
 */
function Util() {
	// -------------------------------------------------------------------------
	// Instance Member
	// -------------------------------------------------------------------------

	// -------------------------------------------------------------------------
	// Process
	// -------------------------------------------------------------------------
}

// -----------------------------------------------------------------------------
// Class Member
// -----------------------------------------------------------------------------
/**
 * @type {string}
 * @default
 * @const
 */
Util.DEFAULT_TIMESTAMP_FORMAT = 'YYYY/MM/DD hh:mm:ss.SSS';

/**
 * @type {string}
 * @default
 * @const
 */
Util.DATE_TIME_FORMAT = 'YYYY/MM/DD hh:mm:ss';

/**
 * @type {string}
 * @default
 * @const
 */
Util.DATE_TIME_MIN_FORMAT = 'YYYY/MM/DD hh:mm';

/**
 * @type {string}
 * @default
 * @const
 */
Util.DATE_TIME_DAY_FORMAT = 'YYYY/MM/DD';

/**
 * 発行済みIDのキャッシュ
 * 
 * @private
 * @type {Object}
 */
Util.cacheIds_ = {};

// -----------------------------------------------------------------------------
// Class Method
// -----------------------------------------------------------------------------

// ---------------------------------------------------------
// 日付関連
// ---------------------------------------------------------

// -------------------------------------
// Util.timestamp
// -------------------------------------
/**
 * Date型オブジェクトのタイムスタンプ文字列を取得
 * 
 * @param {Date}
 *            date 日付データ
 * @returns {string} フォーマット済み日付文字列
 */
Util.timestamp = function(date) {

	return Util.getTimestamp(date);
};

// -------------------------------------
// Util.getTimestamp
// -------------------------------------
/**
 * Date型オブジェクトのタイムスタンプ文字列を取得
 * 
 * @param date
 *            {Date} 日付データ
 */
Util.getTimestamp = function(date, format) {

	if (!date) {
		date = new Date();
	}

	return Util.formatDate(date, format || Util.DEFAULT_TIMESTAMP_FORMAT);
};

// -------------------------------------
// Util.formatDate
// -------------------------------------
/**
 * Date型オブジェクトを指定文字列に従ってフォーマットします。
 * 
 * @param date
 *            {Date} 日付データ
 * @param format
 *            {string} フォーマット文字列
 * @returns {string} フォーマット済み日付文字列
 */
Util.formatDate = function(date, format) {

	console.assert(date, "no date");

	if (!format) {
		format = Util.DEFAULT_TIMESTAMP_FORMAT;
	}

	format = format.replace(/YYYY/g, date.getFullYear());
	format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
	format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
	format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
	format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
	format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));

	if (format.match(/S/g)) {
		var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
		var length = format.match(/S/g).length;
		for (var i = 0; i < length; i++)
			format = format.replace(/S/, milliSeconds.substring(i, i + 1));
	}

	return format;
};

// ---------------------------------------------------------
// 情報取得・リフレクション・メタ処理関連
// ---------------------------------------------------------

// -------------------------------------
// Util.async
// -------------------------------------
/**
 * 非同期実行・キューイング
 * 
 * @param {Function}
 *            func
 * @param {number}
 *            [msec=1]
 */
Util.async = function(func, msec) {
	if (msec === undefined || !(msec > 0)) {
		msec = 1;
	}
	setTimeout(func, msec);
};

/**
 * @param {Object}
 *            obj Input Object
 * @param {boolean}
 *            formatFlag JSONフォーマット要否
 */
Util.dump = function(obj, formatFlag) {
	var result = "";
	if (obj !== undefined) {
		var className = Util.getClassName(obj);
		var json;
		try {
			var proto = Object.getPrototypeOf(obj);
			if (className != "Object" && proto.hasOwnProperty("toString")) {
				json = proto.toString.apply(obj, null);
			} else {
				json = Util.convFromObjectToJson(obj, formatFlag);
			}
		} catch (e) {
			json = Util.toString(obj, null, formatFlag);
		}
		result = "[" + className + "] " + json;
	} else {
		result += obj;
	}
	return result;
};

/**
 * @param {any}
 *            obj 入力オブジェクト(または、プロパティの配列)
 * @returns {string}
 */
Util.toString = function(obj, props, formatFlag) {
	var result = "";
	var temp = {};
	props = props || [];

	if (props.length === 0) {
		for ( var ix in obj) {
			props.push(ix);
		}
	}

	for ( var ix in props) {
		var prop = props[ix];
		if (Util.isArray(obj[prop])) {
			temp[prop] = "Array(" + obj[prop].length + ")";
		} else if (Util.isMap(obj[prop])) {
			temp[prop] = "Map(" + obj[prop].size + ")";
		} else {
			temp[prop] = obj[prop];
		}
	}

	try {
		result = Util.convFromObjectToJson(temp, formatFlag);
	} catch (e) {
	}

	return result;
};

/**
 * プロトタイプ名を取得します。
 * 
 * @param {any}
 *            obj
 * @returns {string} プロトタイプ名
 */
Util.getProtoName = function(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1);
};

/**
 * クラス名・コンストラクタ名を取得します。
 * 
 * @param {any}
 *            obj
 * @returns {string} クラス名・コンストラクタ名
 */
Util.getClassName = function(obj) {

	if (obj == null) {
		// obj が undefined または null の場合は、プロトタイプ名("Undefined" または "Null")を返却
		return Util.getProtoName(obj);
	}

	return obj.__proto__.constructor.name;
};

// -------------------------------------
// Util.getBrowser
// -------------------------------------
/**
 * 使用ブラウザを取得します
 * 
 * @returns ブラウザ名。"chrome", "safari", "opera", "firefox", "msie6", "msie7", "msie8", "msie9", "msie10", "msie11", "msie"(other)
 */
Util.getBrowser = function() {
	var ua = window.navigator.userAgent.toLowerCase();
	var ver = window.navigator.appVersion.toLowerCase();
	var name = "unknown";

	if (ua.indexOf("chrome") != -1) {
		name = "chrome";
	} else if (ua.indexOf("safari") != -1) {
		name = "safari";
	} else if (ua.indexOf("opera") != -1) {
		name = "opera";
	} else if (ua.indexOf("firefox") != -1) {
		name = "firefox";
	} else if (ua.indexOf("msie") != -1) {
		if (ver.indexOf("msie 6.") != -1) {
			name = "msie6";
		} else if (ver.indexOf("msie 7.") != -1) {
			name = "msie7";
		} else if (ver.indexOf("msie 8.") != -1) {
			name = "msie8";
		} else if (ver.indexOf("msie 9.") != -1) {
			name = "msie9";
		} else if (ver.indexOf("msie 10.") != -1) {
			name = "msie10";
		} else {
			name = "msie";
		}
	} else if (ua.indexOf("trident/7") != -1) {
		name = "msie11";
	}

	return name;
};

/**
 * UUID/GUIDを生成します。
 * 
 * @param {boolean}
 *            [uniq=true] アプリ・メモリ内においてユニークを保証するフラグ
 * @returns {string} uuid
 */
Util.createUuid = function(uniq) {
	var result = "";
	var random;
	if (uniq === undefined) {
		uniq = true;
	}
	for (var ix = 0; ix < 32; ix++) {
		random = Math.random() * 16 | 0;

		if (ix == 8 || ix == 12 || ix == 16 || ix == 20) {
			result += "-"
		}
		result += (ix == 12 ? 4 : (ix == 16 ? (random & 3 | 8) : random)).toString(16);
	}

	if (uniq) {
		if (Util.cacheIds_[result]) {
			return Util.createUuid(uniq);
		} else {
			Util.cacheIds_[result] = true;
		}
	}

	return result;
}

/**
 * 桁数指定のIDを生成します。
 * 
 * @param {number}
 *            [digit=8] 桁数
 * @returns {string} id
 */
Util.createId = function(digit, uniq) {
	var result = "";
	var random;
	digit = digit > 0 ? digit : 8;

	if (uniq && digit < 8) {
		//log.warn("digit[" + digit + "] will be change to 8 because of keeping uniqueness.");
		digit = 8;
	}

	for (var ix = 0; ix < digit; ix++) {
		random = Math.random() * 16 | 0;
		result += random.toString(16);
	}

	if (uniq) {
		if (Util.cacheIds_[result]) {
			return Util.createId(digit, uniq);
		} else {
			Util.cacheIds_[result] = true;
		}
	}

	return result;
}

// -------------------------------------
// Util.getStackTrace
// -------------------------------------
/**
 * スタックトレースを取得します
 * 
 * @param {Object}
 *            [option] full:全スタックを取得するかどうか。false の場合、「<anonymous>」「(native)」「Util.getStackTrace」 は取り除かれます。<br />
 *            exclude[]:除外する項目(正規表現 AND/OR 配列も可)
 */
Util.getStackTrace = function(opt) {
	var result = [];
	var excludes = [];
	var fullMode = false;

	opt = opt || {};
	fullMode = (opt.full === undefined ? false : opt.full);
	if (opt.exclude) {
		if (Util.isArray(opt.exclude)) {
			for ( var ix in opt.exclude) {
				excludes.push(opt.exclude[ix]);
			}
		} else {
			excludes.push(opt.exclude);
		}
	}

	try {
		// IEは new Error() で stack プロパティの中身が無いため、強制的に例外を発生させる
		xxx.xxx;
	} catch (e) {
		var stacks = e.stack.split("\n");// new Error().stack.split("\n");
		try {
			if (!fullMode) {
				S: for (var ix = 0; ix < stacks.length; ix++) {
					var s = stacks[ix];

					for ( var jx in excludes) {
						var x;
						if (excludes[jx] instanceof RegExp) {
							x = excludes[jx];
						} else {
							x = new RegExp("^.*" + excludes[jx] + ".*$");
						}
						if (s.match(x)) {
							continue S;
						}
					}
					if (s.match(/^Error$/) || s.match(/^ReferenceError/)) {
						result.push("StackTrace");
					} else if (s.match(/^.*\(<anonymous>.*$/)) {
						// none
					} else if (s.match(/^.*\(native\).*$/)) {
						// none
					} else if (s.match(/^.*Util\.getStackTrace.*$/)) {
						// none
					} else {
						result.push(s);
					}
				}
			} else {
				result.push(stacks);
			}
			return result.join("\n");
		} catch (e) {
		}
	}

	return null;
};

// -------------------------------------
// Util.getCaller
// -------------------------------------
/**
 * 呼び出し元を取得します
 * 
 * @param {Object}
 *            [option] depth:遡る深度。デフォルトは直前の呼び出し元(呼び出し先自身)。<br />
 *            exclude[]:除外する項目(正規表現 AND/OR 配列も可)
 * @returns {CallerInfo}
 */
Util.getCaller = function(opt) {

	var result;
	var callers = [];
	var depth;
	var excludes = [];

	opt = opt || {};
	depth = (opt.depth === undefined ? 0 : opt.depth);
	if (opt.exclude) {
		if (Util.isArray(opt.exclude)) {
			for ( var ix in opt.exclude) {
				excludes.push(opt.exclude[ix]);
			}
		} else {
			excludes.push(opt.exclude);
		}
	}

	// return;
	try {
		// IEは new Error() で stack プロパティの中身が無いため、強制的に例外を発生させる
		xxx.xxx;
	} catch (e) {
		var stacks = e.stack.split("\n");// new Error().stack.split("\n");
		try {
			S: for (var ix = 0; ix < stacks.length; ix++) {
				var s = stacks[ix];

				for ( var jx in excludes) {
					var x;
					if (excludes[jx] instanceof RegExp) {
						x = excludes[jx];
					} else {
						x = new RegExp("^.*" + excludes[jx] + ".*$");
					}
					if (s.match(x)) {
						continue S;
					}
				}

				if (s.match(/^Error$/) || s.match(/^ReferenceError/)) {
					// nop
				} else if (s.match(/^.*\(<anonymous>.*$/)) {
					callers.push("StackTrace");
				} else if (s.match(/^.*\(native\).*$/)) {
					callers.push("StackTrace");
				} else if (s.match(/^.*Util\.getCaller.*$/)) {
					// none
				} else {
					callers.push(s);
				}
			}

			if (depth <= callers.length - 1) {
				var caller = callers[depth];
				var browser = Util.getBrowser();

				var method;
				var uri;
				var line;
				var col

				// ↓の様な要素の分解
				// at Monitor.start (http://localhost:9090/wfm/lib/wfm/wfm.js:138:21),
				// at new Monitor (http://localhost:9090/wfm/lib/wfm/wfm.js:116:7),
				// at http://localhost:9090/wfm/:17:16
				var groups = caller.match(/^\s*at (.+ |)\(?((https?|file):\/\/.+):(\d+):(\d+)\)?,?$/);

				method = groups[1];
				uri = groups[2];
				line = groups[4];
				col = groups[5];

				if (method.match(/^Global code $/) || Util.isBlank(method)) {
					method = "global";
				} else {
					method = method.replace(/ +$/, "").replace(".prototype.", ".");
				}

				result = new CallerInfo(method, uri, line, col);

			} else {
				// 指定深度の情報が無い
//				log.warn("No information", {
//					"depth": depth,
//					"result.length": result.length
//				});
			}

			return result;
		} catch (e) {
		}
	}

	return null;
};

// ---------------------------------------------------------
// 判定関連
// ---------------------------------------------------------

// -------------------------------------
// Util.isEmptyString
// -------------------------------------
/**
 * 文字列が空かどうかを判定します。
 * 
 * @param {string}
 *            str 判定対象文字列
 * @param {boolean}
 *            [trim=true]
 * @returns {boolean} isEmptyString 文字列が空かどうか
 */
Util.isEmptyString = function(str, trim) {
	if (trim === undefined) {
		trim = true;
	}
	try {
		return str === null || str === undefined || (trim && str.trim() === "");
	} catch (e) {
		return false;
	}
};

// -------------------------------------
// Util.isBlank
// -------------------------------------
/**
 * 文字列が空かどうかを判定します。
 * 
 * @param {string}
 *            str 判定対象文字列
 * @param [trim=true]
 *            {boolean}
 * @returns isEmptyString {boolean} 文字列が空かどうか
 */
Util.isBlank = function(str, trim) {
	return Util.isEmptyString(str, trim);
};

// -------------------------------------
// Util.isNotBlank
// -------------------------------------
/**
 * 文字列が空でないかどうかを判定します。
 * 
 * @param {string}
 *            str 判定対象文字列
 * @returns {boolean} 文字列が空かどうか
 */
Util.isNotBlank = function(str, trim) {
	return !Util.isBlank(str, trim);
};

// -------------------------------------
// Util.isNaN
// -------------------------------------
/**
 * NaNかどうかを判定
 * 
 * @param {object}
 *            obj 判定対象
 * @returns {boolean} NaNかどうか
 */
Util.isNaN = function(obj) {
	return obj !== obj;
};

// -------------------------------------
// Util.is
// -------------------------------------
/**
 * 対象オブジェクトの型判定を行います。プロトタイプまたはコンストラクタが指定されたものと同じかどうかを判定します。
 * 
 * @param {string}
 *            type 判定する型の文字列表現
 * @param {Object}
 *            obj 判定するオブジェクト
 * @returns obj が type の型かどうか
 */
Util.is = function(type, obj) {
	var protoName = Util.getProtoName(obj)
	var className = Util.getClassName(obj);

	return protoName === type || className === type;
}

// -------------------------------------
// Util.isString
// -------------------------------------
/**
 * オブジェクトが String 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} String 型かどうか
 */
Util.isString = function(obj) {
	return Util.is("String", obj);
};

// -------------------------------------
// Util.isNumber
// -------------------------------------
/**
 * オブジェクトが Number 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} Number 型かどうか
 */
Util.isNumber = function(obj) {
	return Util.is("Number", obj);
};

// -------------------------------------
// Util.isBoolean
// -------------------------------------
/**
 * オブジェクトが Boolean 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} Boolean 型かどうか
 */
Util.isBoolean = function(obj) {
	return Util.is("Boolean", obj);
};

// -------------------------------------
// Util.isDate
// -------------------------------------
/**
 * オブジェクトが Date 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} Date 型かどうか
 */
Util.isDate = function(obj) {
	return Util.is("Date", obj);
};

// -------------------------------------
// Util.isError
// -------------------------------------
/**
 * オブジェクトが Error 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} Error 型かどうか
 */
Util.isError = function(obj) {
	return Util.is("Error", obj);
};

// -------------------------------------
// Util.isArray
// -------------------------------------
/**
 * オブジェクトが Array 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} Array 型かどうか
 */
Util.isArray = function(obj) {
	return Util.is("Array", obj);
};

// -------------------------------------
// Util.isMap
// -------------------------------------
/**
 * オブジェクトが Map 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} Map 型かどうか
 */
Util.isMap = function(obj) {
	return Util.is("Map", obj);
};

// -------------------------------------
// Util.isFunction
// -------------------------------------
/**
 * オブジェクトが Function 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} Function 型かどうか
 */
Util.isFunction = function(obj) {
	return Util.is("Function", obj);
};

// -------------------------------------
// Util.isRegExp
// -------------------------------------
/**
 * オブジェクトが RegExp 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} RegExp 型かどうか
 */
Util.isRegExp = function(obj) {
	return Util.is("RegExp", obj);
};

// -------------------------------------
// Util.isObject
// -------------------------------------
/**
 * オブジェクトが Object 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} Object 型かどうか
 */
Util.isObject = function(obj) {
	return Util.is("Object", obj);
};

// -------------------------------------
// Util.isNull
// -------------------------------------
/**
 * オブジェクトが Null 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} Null 型かどうか
 */
Util.isNull = function(obj) {
	return Util.is("Null", obj);
};

// -------------------------------------
// Util.isUndefined
// -------------------------------------
/**
 * オブジェクトが Undefined 型かどうかを判定します。
 * 
 * @param {object}
 *            obj 判定対象オブジェクト
 * @returns {boolean} Undefined 型かどうか
 */
Util.isUndefined = function(obj) {
	return Util.is("Undefined", obj);
};

// -------------------------------------
// Util.isSingleByteChar
// -------------------------------------
/**
 * 文字がシングルバイト文字かどうかを判定します。
 * 
 * @param {any}
 *            c 判定対象文字or文字コード
 * @returns {boolean} シングルバイト文字かどうか
 */
Util.isSingleByteChar = function(obj) {

	var c;
	if (Util.isString(obj)) {
		c = obj.charCodeAt(0);
	} else if (Util.isNumber(obj)) {
		c = obj;
	} else {
		return undefined;
	}

	// Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
	// Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
	return (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
};

// ---------------------------------------------------------
// 文字列操作関連
// ---------------------------------------------------------

// -------------------------------------
// Util.substrByteLen
// -------------------------------------
/**
 * 文字列を指定バイト位置から、指定バイト長切り出します(ASCII文字以外は2バイト換算)
 * 
 * @param {string}
 *            str カウント対象文字列
 * @returns {number} 文字列バイト長
 */
Util.substrByteLen = function(str, startB, lenB) {

	var result = "";
	var pos = false;

	var resultLen = 0;

	for (var ix = 0, ixB = 0; ix < str.length; ix++) {

		if (!pos && ixB >= startB) {
			pos = true;
		}

		var c = str.charAt(ix);
		var cc = str.charCodeAt(ix);
		var addLen;

		if ((cc >= 0x0 && cc < 0x81) //
						|| (cc == 0xf8f0) //
						|| (cc >= 0xff61 && cc < 0xffa0) //
						|| (cc >= 0xf8f1 && cc < 0xf8f4) //
		/* Util.isSingleByteChar(cc) */
		) {
			addLen = 1;
		} else {
			addLen = 2;
		}
		ixB += addLen;

		// if (lenB != null && (Util.getByteLen(result) >= lenB || Util.getByteLen(result + c) > lenB)) {
		if (lenB != null && (resultLen >= lenB || (resultLen + addLen) > lenB)) {
			break;
		}

		if (pos) {
			result += c;
			resultLen += addLen;
		}

	}

	return result;
};

// -------------------------------------
// Util.getByteLen
// -------------------------------------
/**
 * 文字列のバイト長をカウントします(ASCII文字以外は2バイト換算)
 * 
 * @param {string}
 *            str カウント対象文字列
 * @returns {number} 文字列バイト長
 */
Util.getByteLen = function(str) {

	var result = 0;
	for (var ix = 0; ix < str.length; ix++) {
		var c = str.charCodeAt(ix);
		if (Util.isSingleByteChar(c)) {
			result += 1;
		} else {
			result += 2;
		}
	}
	return result;
};

// -------------------------------------
// Util.trimByteLen
// -------------------------------------
/**
 * 指定バイト長分、文字列を切り出します。
 * 
 * @param {string}
 *            str 対象文字列
 * @param {number}
 *            len バイト長
 * @param {boolean}
 *            trimLeft 左側を切り落とす(右側から残す)かどうか
 * @returns {string} 埋め済み文字列
 */
Util.trimByteLen = function(str, len, trimLeft) {

	var result = str;

	while (true) {
		if (Util.getByteLen(result) <= len) {
			break;
		}

		if (trimLeft) {
			result = result.slice((result.length - 1) * -1);
		} else {
			result = result.slice(0, len);
		}
	}

	return Util.padByteLen(result, len, " ", !trimLeft);
};

// -------------------------------------
// Util.padSpace
// -------------------------------------
/**
 * 指定バイト長分、右側にスペース埋めをします。
 * 
 * @param {string}
 *            str 対象文字列
 * @param {number}
 *            len バイト長
 * @returns {string} 埋め済み文字列
 */
Util.padSpace = function(str, len) {

	return Util.padByteLen(str, len, " ", false);
};

// -------------------------------------
// Util.padByteLen
// -------------------------------------
/**
 * 指定バイト長分文字埋めをします。
 * 
 * @param {string}
 *            str 対象文字列
 * @param {number}
 *            len バイト長
 * @param {string}
 *            pad 埋める文字
 * @param {boolean}
 *            padLeft 左に埋める(＝右詰め)かどうか
 * @returns {string} 埋め済み文字列
 */
Util.padByteLen = function(str, len, pad, padLeft) {

	var result;

	if (!Util.isString(str)) {
		result = "" + str;
	} else {
		result = str;
	}

	if (Util.isBlank(pad, false)) {
		pad = " ";
	}

	while (true) {
		if (Util.getByteLen(result) >= len || Util.getByteLen(result + pad) > len) {
			break;
		}

		if (padLeft) {
			result = pad + result;
		} else {
			result = result + pad;
		}
	}

	return result;
};

// ---------------------------------------------------------
// 変換関連
// ---------------------------------------------------------

// -------------------------------------
// Util.convFromJsonToObject
// -------------------------------------
/**
 * @param {string}
 *            jsonString JSON String
 * @returns {Object} obj Converted Object
 */
Util.convFromJsonToObject = function(jsonString) {

	return JSON.parse(jsonString);
};

// -------------------------------------
// Util.convFromObjectToJson
// -------------------------------------
/**
 * @param {Object}
 *            obj Input Object
 * @param {boolean}
 *            formatFlag JSONフォーマット要否
 * @returns {string} jsonString JSON String
 */
Util.convFromObjectToJson = function(obj, formatFlag) {

	var format = undefined;
	if (formatFlag === undefined || formatFlag) {
		format = "  ";
	}
	return JSON.stringify(obj, null, format);
};

// -------------------------------------
// Util.formatJson
// -------------------------------------
/**
 * JSON文字列を(再)フォーマットします。文字列以外を指定した場合は、Util.convFromObjectToJson と同じ結果になります。
 * 
 * @param {any}
 *            objOrStr Object or JSON String
 * @param {boolean}
 *            [formatFlag=false]
 * @returns {string} JSON string
 */
Util.formatJson = function(objOrStr, formatFlag) {

	var obj;
	if (Util.isString(objOrStr)) {
		try {
			obj = Util.convFromJsonToObject(objOrStr)
		} catch (e) {
			return e.toString();
		}
	} else {
		obj = objOrStr;
	}

	if (formatFlag === undefined) {
		formatFlag = false;
	}

	return Util.convFromObjectToJson(obj, formatFlag);

};

// -------------------------------------
// Util.emptyArray
// -------------------------------------
/**
 * 配列を破壊的に空にします(配列の内容が変更されます)。<br />
 * 
 * @param {Array}
 *            ary 空にする配列
 */
Util.emptyArray = function(ary) {
	if (Util.isArray(ary)) {
		ary.splice(0, ary.length);
	}
};

// -------------------------------------
// Util.concatArray
// -------------------------------------
/**
 * 配列1に配列2を破壊的に結合します(配列1の内容が変更されます)。<br />
 * destructive が false の場合、非破壊的に結合します(配列1は変更されません)。
 * 
 * @param {Array}
 *            ary1 配列1
 * @param {Array}
 *            ary2 配列2
 * @param {boolean}
 *            [destructive=true]
 * @returns {Array} 結合された配列オブジェクト。destructive==trueの場合、配列1と同じもの。
 */
Util.concatArray = function(ary1, ary2, destructive) {
	destructive = destructive === undefined ? true : destructive;

	if (destructive) {
		return Array.prototype.push.apply(ary1, ary2)
	} else {
		return ary1.concat(ary2)
	}
};

// -------------------------------------
// Util.toArray
// -------------------------------------
/**
 * 入力オブジェクトを配列にして返却します。
 * 
 * @param {any}
 *            obj 入力オブジェクト
 * @returns {Array} 配列化オブジェクト
 */
Util.toArray = function(obj) {
	if (Util.isArray(obj)) {
		return obj;
	} else if (Util.is("Arguments", obj)) {
		return Array.prototype.slice.call(obj);
	} else {
		return [obj];
	}
};

// -------------------------------------
// Util.toInt
// -------------------------------------
/**
 * 入力オブジェクトを数値にして返却します。
 * 
 * @param {any}
 *            obj 入力オブジェクト
 * @returns {Array} 配列化オブジェクト
 */
Util.toInt = function(obj, radix) {
	return parseInt(obj, radix || 10);
};

// -------------------------------------
// Util.toDate
// -------------------------------------
/**
 * 日付文字列をDate型オブジェクトに変換します。
 * 
 * @param {string}
 *            dateString 日付文字列
 * @returns {Date} 日付オブジェクト
 */
Util.toDate = function(dateString) {
	var result = null;

	var year_to_sec, msec;
	var regex;

	if (dateString.match(/^[0-9]+$/)) {
		// 記号なしの場合
		regex = /^([0-9]{4})([0-9]{0,2})([0-9]{0,2})([0-9]{0,2})([0-9]{0,2})([0-9]{0,2})([0-9]{0,})$/;
	} else {
		// 記号ありの場合
		regex = /^([0-9]{4})[^0-9]{0,}([0-9]{0,2})[^0-9]{0,}([0-9]{0,2})[^0-9]{0,}([0-9]{0,2})[^0-9]{0,}([0-9]{0,2})[^0-9]{0,}([0-9]{0,2})[^0-9]{0,}([0-9]{0,})$/;
	}

	if (!dateString.match(regex)) {
		return result; // null
	}

	// 表記を標準化(YYYY/MM/DD hh:mm:ss)する
	year_to_sec = dateString.replace(regex, function(whole, year, mon, day, hour, min, sec, msec) {
		return (Util.isNotBlank(year) ? year : "0000") + "/" + //
		(Util.isNotBlank(mon) ? mon : "01") + "/" + //
		(Util.isNotBlank(day) ? day : "01") + " " + //
		(Util.isNotBlank(hour) ? hour : "00") + ":" + //
		(Util.isNotBlank(min) ? min : "00") + ":" + //
		(Util.isNotBlank(sec) ? sec : "00");
	});

	msec = dateString.replace(regex, function(whole, year, mon, day, hour, min, sec, msec) {
		if (msec && msec.length > 3) {
			msec = msec.substring(0, 3);
		}
		return Util.isNotBlank(msec) ? msec : "000";
	});

	result = new Date(year_to_sec);
	result.setMilliseconds(msec);

	return result;
};

// ---------------------------------------------------------
// URL関連
// ---------------------------------------------------------
// -------------------------------------
// Util.getUrlParam
// -------------------------------------
/**
 * URLからパラメータを取得
 * 
 * @param {string}
 *            url
 * @returns {object} param
 */
Util.getUrlParam = function(url) {
	//log.called();

	var result = null;

	if (url && url.match(/\?/)) {
		var index = url.indexOf("?");
		var paramList = url.substring(index + 1).split(/&/);
		for ( var ix in paramList) {
			var key = paramList[ix].split(/=/)[0];
			var value = paramList[ix].split(/=/)[1];

			result = result || {};
			result[key] = decodeURIComponent(value);
		}
	}
	return result;
};

// -------------------------------------
// Util.getUrlHash
// -------------------------------------
/**
 * URLからハッシュを取得
 * 
 * @param {string}
 *            url
 * @returns {object} param
 */
Util.getUrlHash = function(url) {
	//log.called();

	var result = null;

	if (url && url.match(/#/)) {
		// url = url.split(/\?/)[0]; // パラメータ(?以降)を読み捨てる
		var index = url.indexOf("#");
		var paramList = url.substring(index + 1).split(/&/);
		for ( var ix in paramList) {
			var key = paramList[ix].split(/=/)[0];
			var value = paramList[ix].split(/=/)[1];

			result = result || {};
			result[key] = decodeURIComponent(value);
		}
	}
	return result;
};

// -------------------------------------
// Util.makeUrlParamString
// -------------------------------------
/**
 * URLからパラメータを取得
 * 
 * @param {object}
 *            params
 * @returns {string}
 */
Util.makeUrlParamString = function(params, prefix) {
	var result = null;
	if (Util.isBlank(prefix)) {
		prefix = "?";
	}
	for ( var key in params) {
		if (result === null) {
			result = prefix;
		} else {
			result += "&";
		}

		if (params[key] === undefined) {
			result += key;
		} else {
			result += key + "=" + encodeURIComponent(params[key]);
		}
	}
	return result;
};

// -------------------------------------
// Util.makeUrlParamString
// -------------------------------------
/**
 * URLからパラメータを取得
 * 
 * @param {object}
 *            params
 * @param {string}
 *            prefix
 * @returns {string}
 */
Util.makeUrlParamString = function(params, prefix) {
	var result = null;
	if (Util.isBlank(prefix)) {
		prefix = "?";
	}
	for ( var key in params) {
		if (result === null) {
			result = prefix;
		} else {
			result += "&";
		}

		if (params[key] === undefined) {
			result += key;
		} else {
			result += key + "=" + encodeURIComponent(params[key]);
		}
	}
	return result;
};

// -------------------------------------
// Util.makeUrlHashString
// -------------------------------------
/**
 * ハッシュ(アンカー)文字列を作成
 * 
 * @param {object}
 *            params
 * @returns {string}
 */
Util.makeUrlHashString = function(params) {
	return Util.makeUrlParamString(params, "#");
}

// -------------------------------------
// Util.makeUrlString
// -------------------------------------
/**
 * URLとパラメータからURL文字列を作成<br />
 * 元URLのパラメータは無視
 * 
 * @param {string}
 *            url
 * @param {object}
 *            params
 * @param {object}
 *            hashs
 * @returns {string}
 */
Util.makeUrlString = function(url, params, hashs) {
	var result = null;

	if (url) {
		result = url.split("#")[0].split("?")[0];
		if (hashs) {
			result += Util.makeUrlHashString(hashs);
		}
		if (params) {
			result += Util.makeUrlParamString(params);
		}
	}

	return result;
};

// -------------------------------------
// Util.makeUrlStringFromHash
// -------------------------------------
/**
 * URLとHashからURL文字列を作成<br />
 * 元URLのHashは無視
 * 
 * @param {string}
 *            url
 * @param {object}
 *            hashs
 * @returns {string}
 */
Util.makeUrlStringFromHash = function(url, hashs) {
	var result = null;

	if (url) {
		result = url.split("#")[0];
		if (hashs) {
			result += Util.makeUrlHashString(hashs);
		}
	}

	return result;
};

// ---------------------------------------------------------
// I/O関連
// ---------------------------------------------------------

// -------------------------------------
// Util.downloadAsFile
// -------------------------------------
/**
 * ファイルとしてダウンロード
 * 
 * @param {string}
 *            filename
 * @param [string]
 *            contents
 * @param {string}
 *            [mimeType="text/plain"]
 */
Util.downloadAsFile = function(filename, contents, mimeType /* default: "text/plain" */) {
	mimeType = mimeType || "text/plain";

	// BOMは文字化け対策
	var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
	var blob = new Blob([bom, contents], {
		type: mimeType
	});

	var a = document.createElement("a");
	a.download = filename;
	a.target = "_blank";

	if (window.navigator.msSaveBlob) {
		// for IE
		window.navigator.msSaveBlob(blob, filename)
	} else if (window.URL && window.URL.createObjectURL) {
		// for Firefox
		a.href = window.URL.createObjectURL(blob);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	} else if (window.webkitURL && window.webkitURL.createObject) {
		// for Chrome
		a.href = window.webkitURL.createObjectURL(blob);
		a.click();
	} else {
		// for Safari
		window.open("data:" + mimeType + ";base64," + window.Base64.encode(content), "_blank");
	}

};

// -----------------------------------------------------------------------------
// Instance Property
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Instance Method
// -----------------------------------------------------------------------------
