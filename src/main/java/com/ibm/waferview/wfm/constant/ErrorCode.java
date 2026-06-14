package com.ibm.waferview.wfm.constant;

public enum ErrorCode {
	//N**: Normal
	//E**: Error
	//W**: Warn
	//Normal End
	N00000000("Normal End");
//	E00010001("Input Parameter Error:Some Field Value Is Empty"),
//
//	W00010002("Alarm received,But Will Be Ignored As Message Is Undefined Or Not Enabled In AMS Settings");
//	
	//Other Error Code
	
	
	private final String errMsg;
	ErrorCode(String errMsg) {
		this.errMsg = errMsg;
	}
	
	public String getErrMsg() {
		return this.errMsg;
	}
	
	@Override
	public String toString() {
		return this.name() + "-" + this.errMsg;
	}
}
