package com.example.crm.exception;

public class DuplicateSkuException extends RuntimeException {
    public DuplicateSkuException(String message) {
        super(message);
    }
}
