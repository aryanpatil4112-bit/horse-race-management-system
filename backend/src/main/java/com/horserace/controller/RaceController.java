package com.horserace.controller;

import com.horserace.dto.ApiResponse;
import com.horserace.dto.RaceDTO;
import com.horserace.entity.RaceStatus;
import com.horserace.service.RaceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
public class RaceController {

    private final RaceService raceService;

    public RaceController(RaceService raceService) {
        this.raceService = raceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RaceDTO>>> getAllRaces(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) RaceStatus status) {
        List<RaceDTO> races = raceService.getAllRaces(search, status);
        return ResponseEntity.ok(ApiResponse.ok("Races retrieved successfully", races));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RaceDTO>> getRaceById(@PathVariable Long id) {
        RaceDTO race = raceService.getRaceById(id);
        return ResponseEntity.ok(ApiResponse.ok(race));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RaceDTO>> createRace(@Valid @RequestBody RaceDTO raceDTO) {
        RaceDTO createdRace = raceService.createRace(raceDTO);
        return new ResponseEntity<>(ApiResponse.ok("Race scheduled successfully", createdRace), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RaceDTO>> updateRace(@PathVariable Long id, @Valid @RequestBody RaceDTO raceDTO) {
        RaceDTO updatedRace = raceService.updateRace(id, raceDTO);
        return ResponseEntity.ok(ApiResponse.ok("Race updated successfully", updatedRace));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRace(@PathVariable Long id) {
        raceService.deleteRace(id);
        return ResponseEntity.ok(ApiResponse.ok("Race deleted successfully", null));
    }
}
