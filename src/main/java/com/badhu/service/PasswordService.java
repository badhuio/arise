package com.badhu.service;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    private static final Argon2 argon2 = Argon2Factory.create();

//    hash to save
    public static String hash(String password) {
        return argon2.hash(3,16384,1,password.toCharArray());
    }

//    verify hash to login
    public static boolean verify(String hash, String password) {
        return argon2.verify(hash,password.toCharArray());
    }


}
