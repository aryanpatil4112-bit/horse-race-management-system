package com.horserace.controller;

import com.horserace.dto.ApiResponse;
import com.horserace.dto.ResultDTO;
import com.horserace.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResultDTO>>> getResults(
            @RequestParam(required = false) Long raceId) {
        List<ResultDTO> results = resultService.getResultsByRace(raceId);
        return ResponseEntity.ok(ApiResponse.ok("Results retrieved successfully", results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResultDTO>> getResultById(@PathVariable Long id) {
        ResultDTO result = resultService.getResultById(id);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResultDTO>> recordResult(@Valid @RequestBody ResultDTO dto) {
        ResultDTO created = resultService.recordResult(dto);
        return new ResponseEntity<>(ApiResponse.ok("Race result recorded successfully", created), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return ResponseEntity.ok(ApiResponse.ok("Result deleted successfully", null));
    }
}
