package com.badhu.dto.successDTO;

public class apiResponse {
    private String message;

    public apiResponse(String message){
        this.message = message;
    }
    public String getMessage() {return message;}
    public void setMessage(String message) {this.message = message;}


}
