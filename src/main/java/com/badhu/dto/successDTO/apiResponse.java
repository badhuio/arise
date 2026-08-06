package com.badhu.dto.successDTO;

import lombok.Getter;
import lombok.Setter;

public class apiResponse {
    @Setter
    @Getter
    private String message;
    @Getter
    private String username;

    public apiResponse(String message,String username){
        this.message = message; this.username = username;
    }

}
