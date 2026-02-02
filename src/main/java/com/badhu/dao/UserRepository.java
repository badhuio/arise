package com.badhu.dao;

import com.badhu.entity.SignupEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface UserRepository extends JpaRepository<SignupEntity, Long>{
    boolean existsByEmailAndPassword(String email, String password);
}