package com.horserace.repository;

import com.horserace.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByRaceRaceIdOrderByPositionAsc(Long raceId);
    List<Result> findByHorseHorseId(Long horseId);

    Optional<Result> findByRaceRaceIdAndPosition(Long raceId, Integer position);
    Optional<Result> findByRaceRaceIdAndHorseHorseId(Long raceId, Long horseId);

    boolean existsByRaceRaceIdAndPosition(Long raceId, Integer position);
    boolean existsByRaceRaceIdAndHorseHorseId(Long raceId, Long horseId);

    // Fetch top 5 recent results across all races
    @Query("SELECT r FROM Result r " +
           "JOIN FETCH r.race race " +
           "JOIN FETCH r.horse horse " +
           "JOIN FETCH r.jockey jockey " +
           "ORDER BY r.resultId DESC")
    List<Result> findRecentResults();
}
