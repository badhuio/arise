package com.badhu.service;

import com.badhu.converter.Converters;
import com.badhu.dao.UserRepository;
import com.badhu.dto.LoginDTO;
import com.badhu.dto.SignupDTO;
import com.badhu.entity.SignupEntity;
import org.springframework.stereotype.Service;

@Service
public class SignupService {


    private final UserRepository userRepository;
    public SignupService(UserRepository userRepository)
        { this.userRepository = userRepository; }

    //signup_saving
    public String signupSaving(SignupDTO dto){

        try{

            if (dto.getUsername()==null|| dto.getEmail()==null || dto.getPassword()==null){
                throw new IllegalArgumentException("All fields are required");
            }

            SignupEntity entity = Converters.tosignupEntity(dto);

            SignupEntity response = userRepository.save(entity);


        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return null;
    }

    //login_checking
    public boolean loginchecking(LoginDTO dto){
        try{
            if(dto.getEmail()==null || dto.getPassword()==null){
                throw new IllegalArgumentException("All fields are required");
            }

            boolean result =  userRepository.existsByEmailAndPassword(dto.getEmail(),dto.getPassword());

            System.out.println("Login Result: " +result);
            return result;
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

}