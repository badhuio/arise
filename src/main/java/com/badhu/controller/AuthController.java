package com.badhu.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    @GetMapping({ "/login"})
    public String login() {
        return "authentication/login_page";
    }

    @GetMapping({"/","/signup"})
    public String signup() {
        return "authentication/signup";
    }

    @GetMapping("/home")
    public String home() { return "home/home";}

    @GetMapping("/playlist")
    public String playlist() {return "playlist/playlist";}
}
