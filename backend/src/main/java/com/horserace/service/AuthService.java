package com.horserace.service;

import com.horserace.dto.AuthDTOs.*;
import com.horserace.entity.Role;
import com.horserace.entity.User;
import com.horserace.exception.BadRequestException;
import com.horserace.exception.ResourceNotFoundException;
import com.horserace.repository.UserRepository;
import com.horserace.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenProvider.generateToken(authentication);

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new BadRequestException("Invalid email or password."));

            return LoginResponse.builder()
                    .token(token)
                    .userId(user.getUserId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();
        } catch (Exception ex) {
            throw new BadRequestException("Invalid email or password.");
        }
    }

    public UserDTO register(RegisterRequest registerRequest) {
        if (registerRequest.getEmail() == null || !registerRequest.getEmail().contains("@")) {
            throw new BadRequestException("Please enter a valid email address.");
        }

        if (registerRequest.getPassword() == null || registerRequest.getPassword().length() < 8) {
            throw new BadRequestException("Password must contain at least 8 characters.");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        // CRITICAL SECURITY ENFORCEMENT: Public signup is strictly VIEWER ONLY.
        // Ignore any client attempt to request ADMIN or RACE_OFFICIAL roles.
        User user = User.builder()
                .name(registerRequest.getName().trim())
                .email(registerRequest.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.VIEWER)
                .build();

        User savedUser = userRepository.save(user);

        return UserDTO.builder()
                .userId(savedUser.getUserId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }
}
