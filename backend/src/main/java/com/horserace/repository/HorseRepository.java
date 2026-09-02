package com.horserace.repository;

import com.horserace.entity.Horse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorseRepository extends JpaRepository<Horse, Long> {
    List<Horse> findByStatus(String status);
    List<Horse> findByNameContainingIgnoreCase(String name);
    List<Horse> findByBreedContainingIgnoreCase(String breed);
}
