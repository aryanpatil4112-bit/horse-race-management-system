package com.horserace.repository;

import com.horserace.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByRaceRaceId(Long raceId);
    List<Registration> findByHorseHorseId(Long horseId);
    List<Registration> findByJockeyJockeyId(Long jockeyId);

    Optional<Registration> findByRaceRaceIdAndHorseHorseId(Long raceId, Long horseId);
    boolean existsByRaceRaceIdAndHorseHorseId(Long raceId, Long horseId);

    // Custom SQL/JPQL JOIN Query demonstrating 3-table join
    @Query("SELECT r FROM Registration r " +
           "JOIN FETCH r.race race " +
           "JOIN FETCH r.horse horse " +
           "JOIN FETCH r.jockey jockey " +
           "WHERE race.raceId = :raceId")
    List<Registration> findFullRegistrationDetailsByRaceId(@Param("raceId") Long raceId);
}
