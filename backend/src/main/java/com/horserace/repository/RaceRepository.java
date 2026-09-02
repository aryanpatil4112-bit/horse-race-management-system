package com.horserace.repository;

import com.horserace.entity.Race;
import com.horserace.entity.RaceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RaceRepository extends JpaRepository<Race, Long> {
    List<Race> findByStatus(RaceStatus status);
    List<Race> findByRaceNameContainingIgnoreCase(String name);
    List<Race> findByRaceDateGreaterThanEqualOrderByRaceDateAsc(LocalDate date);
    long countByStatus(RaceStatus status);
}
