package com.horserace.service;

import com.horserace.dto.JockeyDTO;
import com.horserace.entity.Jockey;
import com.horserace.exception.ResourceNotFoundException;
import com.horserace.repository.JockeyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JockeyService {

    private final JockeyRepository jockeyRepository;

    public JockeyService(JockeyRepository jockeyRepository) {
        this.jockeyRepository = jockeyRepository;
    }

    public List<JockeyDTO> getAllJockeys(String search, String status) {
        List<Jockey> jockeys;
        if (search != null && !search.trim().isEmpty()) {
            jockeys = jockeyRepository.findByNameContainingIgnoreCase(search.trim());
        } else if (status != null && !status.trim().isEmpty()) {
            jockeys = jockeyRepository.findByStatus(status.trim().toUpperCase());
        } else {
            jockeys = jockeyRepository.findAll();
        }

        return jockeys.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public JockeyDTO getJockeyById(Long id) {
        Jockey jockey = jockeyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jockey not found with id: " + id));
        return mapToDTO(jockey);
    }

    public JockeyDTO createJockey(JockeyDTO jockeyDTO) {
        Jockey jockey = Jockey.builder()
                .name(jockeyDTO.getName())
                .age(jockeyDTO.getAge())
                .experience(jockeyDTO.getExperience())
                .status(jockeyDTO.getStatus() != null ? jockeyDTO.getStatus() : "ACTIVE")
                .build();

        Jockey savedJockey = jockeyRepository.save(jockey);
        return mapToDTO(savedJockey);
    }

    public JockeyDTO updateJockey(Long id, JockeyDTO jockeyDTO) {
        Jockey jockey = jockeyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jockey not found with id: " + id));

        jockey.setName(jockeyDTO.getName());
        jockey.setAge(jockeyDTO.getAge());
        jockey.setExperience(jockeyDTO.getExperience());
        if (jockeyDTO.getStatus() != null) {
            jockey.setStatus(jockeyDTO.getStatus());
        }

        Jockey updatedJockey = jockeyRepository.save(jockey);
        return mapToDTO(updatedJockey);
    }

    public void deleteJockey(Long id) {
        Jockey jockey = jockeyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jockey not found with id: " + id));
        jockeyRepository.delete(jockey);
    }

    private JockeyDTO mapToDTO(Jockey jockey) {
        return JockeyDTO.builder()
                .jockeyId(jockey.getJockeyId())
                .name(jockey.getName())
                .age(jockey.getAge())
                .experience(jockey.getExperience())
                .status(jockey.getStatus())
                .build();
    }
}
