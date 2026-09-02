package com.horserace.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private long totalHorses;
    private long activeHorses;
    private long totalJockeys;
    private long activeJockeys;
    private long totalRaces;
    private long upcomingRaces;
    private long completedRaces;

    private List<RaceDTO> upcomingRaceList;
    private List<ResultDTO> recentResults;
}
