package com.badhu.service;

import com.badhu.converter.Converters;
import com.badhu.dao.UserRepository;
import com.badhu.dto.LoginDTO;
import com.badhu.dto.SignupDTO;
import com.badhu.dto.successDTO.apiResponse;
import com.badhu.entity.LoginEntity;
import com.badhu.entity.SignupEntity;
import com.badhu.exception.DataBaseExceptions;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SignupService {


    private final UserRepository userRepository;
    public SignupService(UserRepository userRepository)
        { this.userRepository = userRepository; }

    //signup_saving
    public ResponseEntity<apiResponse> signupSaving(SignupDTO dto){

            if (dto.getUsername() == null){
                throw new ResponseStatusException(HttpStatusCode.valueOf(409),"username is required");
            }else if(dto.getEmail()==null){
                throw new ResponseStatusException(HttpStatusCode.valueOf(409),"email is required");
            } else if(dto.getPassword()==null){
                throw new ResponseStatusException(HttpStatusCode.valueOf(409),"password is required");
            }

            SignupEntity entity = Converters.tosignupEntity(dto);

            boolean result = userRepository.existsByEmail(entity.getEmail());

            if(result == true){
                throw new ResponseStatusException(HttpStatusCode.valueOf(409),"email already exists");
            }

            entity.setPassword(PasswordService.hash(entity.getPassword()));
            System.out.println(entity);
        try {
            userRepository.save(entity);
            return ResponseEntity.status(200).body(new apiResponse("user created successfully",null));
        } catch (DataBaseExceptions e) {
            throw new DataBaseExceptions("Database error");
        }
    }

    //login_checking
    public ResponseEntity<apiResponse> loginchecking(LoginDTO dto){

        boolean login;

            if(dto.getEmail()==null){
                throw new ResponseStatusException(HttpStatusCode.valueOf(409),"Email required");
            }else if(dto.getPassword()==null) {
                throw new ResponseStatusException(HttpStatusCode.valueOf(409),"Password required");
            }

        try {
            SignupEntity user = userRepository.findByEmail(dto.getEmail());

            if(user == null){
                throw new ResponseStatusException(HttpStatusCode.valueOf(401),"User not found");
            }

            login = PasswordService.verify(user.getPassword(), dto.getPassword());
                System.out.println(login);
            }catch (DataBaseExceptions e){
                throw new DataBaseExceptions("Database error");
            }

        if (login == true) {
            //jwt + cache implementing
            SignupEntity username = userRepository.findByEmail(dto.getEmail());
            return ResponseEntity .status(200) .body(new apiResponse("user login successfully", username.getUsername()));
        }else {
            throw new ResponseStatusException(HttpStatusCode.valueOf(401), "user login failed");
        }

    }

}