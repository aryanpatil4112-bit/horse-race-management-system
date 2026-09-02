package com.horserace.service;

import com.horserace.dto.RaceDTO;
import com.horserace.entity.Race;
import com.horserace.entity.RaceStatus;
import com.horserace.exception.ResourceNotFoundException;
import com.horserace.repository.RaceRepository;
import com.horserace.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RaceService {

    private final RaceRepository raceRepository;
    private final RegistrationRepository registrationRepository;

    public RaceService(RaceRepository raceRepository, RegistrationRepository registrationRepository) {
        this.raceRepository = raceRepository;
        this.registrationRepository = registrationRepository;
    }

    public List<RaceDTO> getAllRaces(String search, RaceStatus status) {
        List<Race> races;
        if (search != null && !search.trim().isEmpty()) {
            races = raceRepository.findByRaceNameContainingIgnoreCase(search.trim());
        } else if (status != null) {
            races = raceRepository.findByStatus(status);
        } else {
            races = raceRepository.findAll();
        }

        return races.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public RaceDTO getRaceById(Long id) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Race not found with id: " + id));
        return mapToDTO(race);
    }

    public RaceDTO createRace(RaceDTO raceDTO) {
        Race race = Race.builder()
                .raceName(raceDTO.getRaceName())
                .raceDate(raceDTO.getRaceDate())
                .raceTime(raceDTO.getRaceTime())
                .location(raceDTO.getLocation())
                .distance(raceDTO.getDistance())
                .status(raceDTO.getStatus() != null ? raceDTO.getStatus() : RaceStatus.SCHEDULED)
                .build();

        Race savedRace = raceRepository.save(race);
        return mapToDTO(savedRace);
    }

    public RaceDTO updateRace(Long id, RaceDTO raceDTO) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Race not found with id: " + id));

        race.setRaceName(raceDTO.getRaceName());
        race.setRaceDate(raceDTO.getRaceDate());
        race.setRaceTime(raceDTO.getRaceTime());
        race.setLocation(raceDTO.getLocation());
        race.setDistance(raceDTO.getDistance());
        if (raceDTO.getStatus() != null) {
            race.setStatus(raceDTO.getStatus());
        }

        Race updatedRace = raceRepository.save(race);
        return mapToDTO(updatedRace);
    }

    public void deleteRace(Long id) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Race not found with id: " + id));
        raceRepository.delete(race);
    }

    private RaceDTO mapToDTO(Race race) {
        int participantCount = registrationRepository.findByRaceRaceId(race.getRaceId()).size();
        return RaceDTO.builder()
                .raceId(race.getRaceId())
                .raceName(race.getRaceName())
                .raceDate(race.getRaceDate())
                .raceTime(race.getRaceTime())
                .location(race.getLocation())
                .distance(race.getDistance())
                .status(race.getStatus())
                .participantCount(participantCount)
                .build();
    }
}
