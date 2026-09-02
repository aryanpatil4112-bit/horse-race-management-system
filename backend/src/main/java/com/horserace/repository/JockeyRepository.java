package com.horserace.repository;

import com.horserace.entity.Jockey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JockeyRepository extends JpaRepository<Jockey, Long> {
    List<Jockey> findByStatus(String status);
    List<Jockey> findByNameContainingIgnoreCase(String name);
}
