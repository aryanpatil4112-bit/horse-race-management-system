package com.horserace.controller;

import com.horserace.dto.ApiResponse;
import com.horserace.dto.HorseDTO;
import com.horserace.service.HorseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horses")
public class HorseController {

    private final HorseService horseService;

    public HorseController(HorseService horseService) {
        this.horseService = horseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HorseDTO>>> getAllHorses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        List<HorseDTO> horses = horseService.getAllHorses(search, status);
        return ResponseEntity.ok(ApiResponse.ok("Horses retrieved successfully", horses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HorseDTO>> getHorseById(@PathVariable Long id) {
        HorseDTO horse = horseService.getHorseById(id);
        return ResponseEntity.ok(ApiResponse.ok(horse));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HorseDTO>> createHorse(@Valid @RequestBody HorseDTO horseDTO) {
        HorseDTO createdHorse = horseService.createHorse(horseDTO);
        return new ResponseEntity<>(ApiResponse.ok("Horse added successfully", createdHorse), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HorseDTO>> updateHorse(@PathVariable Long id, @Valid @RequestBody HorseDTO horseDTO) {
        HorseDTO updatedHorse = horseService.updateHorse(id, horseDTO);
        return ResponseEntity.ok(ApiResponse.ok("Horse updated successfully", updatedHorse));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHorse(@PathVariable Long id) {
        horseService.deleteHorse(id);
        return ResponseEntity.ok(ApiResponse.ok("Horse deleted successfully", null));
    }
}
