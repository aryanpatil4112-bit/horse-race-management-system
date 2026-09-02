package com.horserace.service;

import com.horserace.dto.DashboardStatsDTO;
import com.horserace.dto.RaceDTO;
import com.horserace.dto.ResultDTO;
import com.horserace.entity.RaceStatus;
import com.horserace.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final HorseRepository horseRepository;
    private final JockeyRepository jockeyRepository;
    private final RaceRepository raceRepository;
    private final ResultRepository resultRepository;
    private final RegistrationRepository registrationRepository;

    public DashboardService(HorseRepository horseRepository,
                             JockeyRepository jockeyRepository,
                             RaceRepository raceRepository,
                             ResultRepository resultRepository,
                             RegistrationRepository registrationRepository) {
        this.horseRepository = horseRepository;
        this.jockeyRepository = jockeyRepository;
        this.raceRepository = raceRepository;
        this.resultRepository = resultRepository;
        this.registrationRepository = registrationRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        long totalHorses = horseRepository.count();
        long activeHorses = horseRepository.findByStatus("ACTIVE").size();

        long totalJockeys = jockeyRepository.count();
        long activeJockeys = jockeyRepository.findByStatus("ACTIVE").size();

        long totalRaces = raceRepository.count();
        long upcomingRaces = raceRepository.countByStatus(RaceStatus.SCHEDULED) + raceRepository.countByStatus(RaceStatus.ONGOING);
        long completedRaces = raceRepository.countByStatus(RaceStatus.COMPLETED);

        // Fetch upcoming races
        List<RaceDTO> upcomingRaceList = raceRepository.findByRaceDateGreaterThanEqualOrderByRaceDateAsc(LocalDate.now())
                .stream()
                .limit(5)
                .map(race -> {
                    int pCount = registrationRepository.findByRaceRaceId(race.getRaceId()).size();
                    return RaceDTO.builder()
                            .raceId(race.getRaceId())
                            .raceName(race.getRaceName())
                            .raceDate(race.getRaceDate())
                            .raceTime(race.getRaceTime())
                            .location(race.getLocation())
                            .distance(race.getDistance())
                            .status(race.getStatus())
                            .participantCount(pCount)
                            .build();
                })
                .collect(Collectors.toList());

        // Fetch recent top 5 results
        List<ResultDTO> recentResults = resultRepository.findRecentResults()
                .stream()
                .limit(5)
                .map(res -> ResultDTO.builder()
                        .resultId(res.getResultId())
                        .raceId(res.getRace().getRaceId())
                        .raceName(res.getRace().getRaceName())
                        .horseId(res.getHorse().getHorseId())
                        .horseName(res.getHorse().getName())
                        .jockeyId(res.getJockey().getJockeyId())
                        .jockeyName(res.getJockey().getName())
                        .position(res.getPosition())
                        .finishTime(res.getFinishTime())
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsDTO.builder()
                .totalHorses(totalHorses)
                .activeHorses(activeHorses)
                .totalJockeys(totalJockeys)
                .activeJockeys(activeJockeys)
                .totalRaces(totalRaces)
                .upcomingRaces(upcomingRaces)
                .completedRaces(completedRaces)
                .upcomingRaceList(upcomingRaceList)
                .recentResults(recentResults)
                .build();
    }
}
