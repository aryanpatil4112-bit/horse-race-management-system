package com.horserace.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardDTO {
    private Integer rank;
    private Long horseId;
    private String horseName;
    private String breed;
    private Integer wins;        // 1st place count
    private Integer secondPlaces; // 2nd place count
    private Integer thirdPlaces;  // 3rd place count
    private Integer totalRaces;
    private String winRate;      // e.g. "50.0%"
}
