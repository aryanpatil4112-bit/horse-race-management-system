package com.horserace.service;

import com.horserace.dto.LeaderboardDTO;
import com.horserace.entity.Horse;
import com.horserace.entity.Result;
import com.horserace.repository.HorseRepository;
import com.horserace.repository.ResultRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    private final HorseRepository horseRepository;
    private final ResultRepository resultRepository;

    public LeaderboardService(HorseRepository horseRepository, ResultRepository resultRepository) {
        this.horseRepository = horseRepository;
        this.resultRepository = resultRepository;
    }

    public List<LeaderboardDTO> getLeaderboard() {
        List<Horse> allHorses = horseRepository.findAll();
        List<Result> allResults = resultRepository.findAll();

        Map<Long, List<Result>> resultsByHorse = allResults.stream()
                .collect(Collectors.groupingBy(r -> r.getHorse().getHorseId()));

        List<LeaderboardDTO> leaderboard = new ArrayList<>();

        for (Horse horse : allHorses) {
            List<Result> horseResults = resultsByHorse.getOrDefault(horse.getHorseId(), Collections.emptyList());

            int wins = (int) horseResults.stream().filter(r -> r.getPosition() == 1).count();
            int secondPlaces = (int) horseResults.stream().filter(r -> r.getPosition() == 2).count();
            int thirdPlaces = (int) horseResults.stream().filter(r -> r.getPosition() == 3).count();
            int totalRaces = horseResults.size();

            double winPercentage = totalRaces > 0 ? ((double) wins / totalRaces) * 100.0 : 0.0;
            String winRateStr = String.format("%.1f%%", winPercentage);

            leaderboard.add(LeaderboardDTO.builder()
                    .horseId(horse.getHorseId())
                    .horseName(horse.getName())
                    .breed(horse.getBreed())
                    .wins(wins)
                    .secondPlaces(secondPlaces)
                    .thirdPlaces(thirdPlaces)
                    .totalRaces(totalRaces)
                    .winRate(winRateStr)
                    .build());
        }

        // Sort leaderboard by: 1) Wins DESC, 2) 2nd Places DESC, 3) 3rd Places DESC
        leaderboard.sort(Comparator
                .comparing(LeaderboardDTO::getWins, Comparator.reverseOrder())
                .thenComparing(LeaderboardDTO::getSecondPlaces, Comparator.reverseOrder())
                .thenComparing(LeaderboardDTO::getThirdPlaces, Comparator.reverseOrder())
                .thenComparing(LeaderboardDTO::getTotalRaces, Comparator.reverseOrder())
        );

        // Assign rank indices
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }

        return leaderboard;
    }
}
