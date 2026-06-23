package com.badhu.exception;

import org.springframework.dao.DataAccessException;

public class DataBaseExceptions extends DataAccessException {

    public DataBaseExceptions(String message){
        super(message);
    }
}
