package com.badhu.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SignupDTO {

    @NotBlank
    private String username;

    @Email
    private String email;

    @Size(min=5, max=20)
    private String password;

}
