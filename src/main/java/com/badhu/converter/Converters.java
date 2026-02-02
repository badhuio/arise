package com.badhu.converter;

import com.badhu.dto.SignupDTO;
import com.badhu.entity.LoginEntity;
import com.badhu.entity.SignupEntity;
import com.badhu.dto.LoginDTO;
import jakarta.persistence.Converter;

public class Converters {

    public static SignupEntity tosignupEntity (SignupDTO dto){
        SignupEntity entity = new SignupEntity();
            entity.setUsername(dto.getUsername());
            entity.setEmail(dto.getEmail());
            entity.setPassword(dto.getPassword());
                return entity;
    }

    public static LoginEntity tologinEntity (LoginDTO dto){
        LoginEntity entity = new LoginEntity();
            entity.setEmail(dto.getEmail());
            entity.setPassword(dto.getPassword());
        return entity;
    }
}
