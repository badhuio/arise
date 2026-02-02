package com.badhu.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

@Entity
@Table(name="login")
public class LoginEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String password;


    public Long getId() { return id; }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email; }

    public String getPassword() {return password; }
    public void setPassword(String password) {this.password = password; }
}
