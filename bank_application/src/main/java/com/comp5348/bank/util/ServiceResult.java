package com.comp5348.bank.util;

public class ServiceResult<T> {
    private boolean success;
    private T data;
    private String errorMessage;

    public ServiceResult(boolean success, T data, String errorMessage) {
        this.success = success;
        this.data = data;
        this.errorMessage = errorMessage;
    }

    public boolean isSuccess() {
        return success;
    }

    public T getData() {
        return data;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public static <T> ServiceResult<T> success(T data) {
        return new ServiceResult<>(true, data, null);
    }

    public static <T> ServiceResult<T> failure(String errorMessage) {
        return new ServiceResult<>(false, null, errorMessage);
    }
}
