package com.horserace.service;

import com.horserace.dto.HorseDTO;
import com.horserace.entity.Horse;
import com.horserace.exception.ResourceNotFoundException;
import com.horserace.repository.HorseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HorseService {

    private final HorseRepository horseRepository;

    public HorseService(HorseRepository horseRepository) {
        this.horseRepository = horseRepository;
    }

    public List<HorseDTO> getAllHorses(String search, String status) {
        List<Horse> horses;
        if (search != null && !search.trim().isEmpty()) {
            horses = horseRepository.findByNameContainingIgnoreCase(search.trim());
        } else if (status != null && !status.trim().isEmpty()) {
            horses = horseRepository.findByStatus(status.trim().toUpperCase());
        } else {
            horses = horseRepository.findAll();
        }

        return horses.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public HorseDTO getHorseById(Long id) {
        Horse horse = horseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horse not found with id: " + id));
        return mapToDTO(horse);
    }

    public HorseDTO createHorse(HorseDTO horseDTO) {
        Horse horse = Horse.builder()
                .name(horseDTO.getName())
                .breed(horseDTO.getBreed())
                .age(horseDTO.getAge())
                .gender(horseDTO.getGender())
                .status(horseDTO.getStatus() != null ? horseDTO.getStatus() : "ACTIVE")
                .build();

        Horse savedHorse = horseRepository.save(horse);
        return mapToDTO(savedHorse);
    }

    public HorseDTO updateHorse(Long id, HorseDTO horseDTO) {
        Horse horse = horseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horse not found with id: " + id));

        horse.setName(horseDTO.getName());
        horse.setBreed(horseDTO.getBreed());
        horse.setAge(horseDTO.getAge());
        horse.setGender(horseDTO.getGender());
        if (horseDTO.getStatus() != null) {
            horse.setStatus(horseDTO.getStatus());
        }

        Horse updatedHorse = horseRepository.save(horse);
        return mapToDTO(updatedHorse);
    }

    public void deleteHorse(Long id) {
        Horse horse = horseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horse not found with id: " + id));
        horseRepository.delete(horse);
    }

    private HorseDTO mapToDTO(Horse horse) {
        return HorseDTO.builder()
                .horseId(horse.getHorseId())
                .name(horse.getName())
                .breed(horse.getBreed())
                .age(horse.getAge())
                .gender(horse.getGender())
                .status(horse.getStatus())
                .build();
    }
}
