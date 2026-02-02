package com.badhu.controller;

import com.badhu.dto.LoginDTO;
import com.badhu.dto.SignupDTO;
import com.badhu.service.SignupService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataController {

    private final SignupService signupService;

    public DataController(SignupService signupService) {
        this.signupService = signupService;
    }

    @PostMapping("/signup_saving")
        public String signup_saving(@RequestBody SignupDTO dto){
            System.out.println("username: "+ dto);
                signupService.signupSaving(dto);
            return null;
        }

    @PostMapping("/login_checking")
        public boolean login_checking(@RequestBody LoginDTO dto){
            System.out.println("username: "+ dto.getEmail());
                return  signupService.loginchecking(dto);
    }
}
