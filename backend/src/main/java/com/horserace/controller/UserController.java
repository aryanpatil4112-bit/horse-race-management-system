package com.horserace.controller;

import com.horserace.dto.ApiResponse;
import com.horserace.dto.AuthDTOs.AdminCreateUserRequest;
import com.horserace.dto.AuthDTOs.UserDTO;
import com.horserace.entity.Role;
import com.horserace.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved successfully", users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDTO>> createUserByAdmin(@Valid @RequestBody AdminCreateUserRequest request) {
        UserDTO user = userService.createUserByAdmin(request);
        return new ResponseEntity<>(ApiResponse.ok("User created successfully", user), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String roleStr = body.get("role");
        if (roleStr == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Role is required"));
        }
        Role newRole = Role.valueOf(roleStr.toUpperCase());
        UserDTO updatedUser = userService.updateUserRole(id, newRole);
        return ResponseEntity.ok(ApiResponse.ok("User role updated successfully", updatedUser));
    }
}
