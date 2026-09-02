package com.horserace.controller;

import com.horserace.dto.ApiResponse;
import com.horserace.dto.JockeyDTO;
import com.horserace.service.JockeyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jockeys")
public class JockeyController {

    private final JockeyService jockeyService;

    public JockeyController(JockeyService jockeyService) {
        this.jockeyService = jockeyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JockeyDTO>>> getAllJockeys(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        List<JockeyDTO> jockeys = jockeyService.getAllJockeys(search, status);
        return ResponseEntity.ok(ApiResponse.ok("Jockeys retrieved successfully", jockeys));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JockeyDTO>> getJockeyById(@PathVariable Long id) {
        JockeyDTO jockey = jockeyService.getJockeyById(id);
        return ResponseEntity.ok(ApiResponse.ok(jockey));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JockeyDTO>> createJockey(@Valid @RequestBody JockeyDTO jockeyDTO) {
        JockeyDTO createdJockey = jockeyService.createJockey(jockeyDTO);
        return new ResponseEntity<>(ApiResponse.ok("Jockey added successfully", createdJockey), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JockeyDTO>> updateJockey(@PathVariable Long id, @Valid @RequestBody JockeyDTO jockeyDTO) {
        JockeyDTO updatedJockey = jockeyService.updateJockey(id, jockeyDTO);
        return ResponseEntity.ok(ApiResponse.ok("Jockey updated successfully", updatedJockey));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJockey(@PathVariable Long id) {
        jockeyService.deleteJockey(id);
        return ResponseEntity.ok(ApiResponse.ok("Jockey deleted successfully", null));
    }
}
