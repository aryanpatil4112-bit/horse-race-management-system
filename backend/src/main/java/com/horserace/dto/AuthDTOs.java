package com.horserace.dto;

import com.horserace.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public class AuthDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Please enter your email address.")
        @Email(message = "Please enter a valid email address.")
        private String email;

        @NotBlank(message = "Please enter your password.")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginResponse {
        private String token;
        private Long userId;
        private String name;
        private String email;
        private Role role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "Please enter your full name.")
        private String name;

        @NotBlank(message = "Please enter your email address.")
        @Email(message = "Please enter a valid email address.")
        private String email;

        @NotBlank(message = "Please enter your password.")
        @Size(min = 8, message = "Password must contain at least 8 characters.")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminCreateUserRequest {
        @NotBlank(message = "Please enter full name.")
        private String name;

        @NotBlank(message = "Please enter email address.")
        @Email(message = "Please enter a valid email address.")
        private String email;

        @NotBlank(message = "Please enter password.")
        @Size(min = 8, message = "Password must contain at least 8 characters.")
        private String password;

        private Role role; // ADMIN, RACE_OFFICIAL, VIEWER
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserDTO {
        private Long userId;
        private String name;
        private String email;
        private Role role;
    }
}
