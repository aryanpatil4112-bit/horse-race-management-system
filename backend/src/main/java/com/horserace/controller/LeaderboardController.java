package com.horserace.controller;

import com.horserace.dto.ApiResponse;
import com.horserace.dto.LeaderboardDTO;
import com.horserace.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaderboardDTO>>> getLeaderboard() {
        List<LeaderboardDTO> leaderboard = leaderboardService.getLeaderboard();
        return ResponseEntity.ok(ApiResponse.ok("Leaderboard retrieved successfully", leaderboard));
    }
}
