/**
 * Copyright IBM Group.
 */
package com.ibm.waferview.wfm.exception;
/**
 * 
 * @author XueJunHe
 *
 */
public class BaseException extends RuntimeException {
	private static final long serialVersionUID = 1381325479896057076L;
	private String code;
	private String message;
	private Throwable throwable;
	private transient Object[] values;

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessage() {
		return this.message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Throwable getThrowable() {
		return this.throwable;
	}

	public void setThrowable(Throwable throwable) {
		this.throwable = throwable;
	}

	public Object[] getValues() {
		return this.values;
	}

	public void setValues(Object[] values) {
		this.values = values;
	}

	public BaseException(String code, String message, Object[] values, Throwable cause) {
		this(code, message, cause);
		this.values = values;
	}

	private BaseException(String code, String message, Throwable cause) {
		super(message, cause);
		this.message = message;
		this.code = code;
	}
}
