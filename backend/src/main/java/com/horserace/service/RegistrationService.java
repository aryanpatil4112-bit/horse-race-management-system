package com.horserace.service;

import com.horserace.dto.RegistrationDTO;
import com.horserace.entity.*;
import com.horserace.exception.BadRequestException;
import com.horserace.exception.ResourceNotFoundException;
import com.horserace.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final RaceRepository raceRepository;
    private final HorseRepository horseRepository;
    private final JockeyRepository jockeyRepository;

    public RegistrationService(RegistrationRepository registrationRepository,
                               RaceRepository raceRepository,
                               HorseRepository horseRepository,
                               JockeyRepository jockeyRepository) {
        this.registrationRepository = registrationRepository;
        this.raceRepository = raceRepository;
        this.horseRepository = horseRepository;
        this.jockeyRepository = jockeyRepository;
    }

    public List<RegistrationDTO> getAllRegistrations(Long raceId) {
        List<Registration> registrations;
        if (raceId != null) {
            registrations = registrationRepository.findFullRegistrationDetailsByRaceId(raceId);
        } else {
            registrations = registrationRepository.findAll();
        }
        return registrations.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public RegistrationDTO getRegistrationById(Long id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));
        return mapToDTO(registration);
    }

    public RegistrationDTO registerParticipant(RegistrationDTO dto) {
        // 1. Verify Race exists & status is valid
        Race race = raceRepository.findById(dto.getRaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Race not found with id: " + dto.getRaceId()));

        if (race.getStatus() == RaceStatus.COMPLETED || race.getStatus() == RaceStatus.CANCELLED) {
            throw new BadRequestException("Cannot register participants for a " + race.getStatus() + " race");
        }

        // 2. Verify Horse exists & is ACTIVE
        Horse horse = horseRepository.findById(dto.getHorseId())
                .orElseThrow(() -> new ResourceNotFoundException("Horse not found with id: " + dto.getHorseId()));

        if ("INACTIVE".equalsIgnoreCase(horse.getStatus())) {
            throw new BadRequestException("Horse '" + horse.getName() + "' is INACTIVE and cannot be registered");
        }

        // 3. Verify Jockey exists & is ACTIVE
        Jockey jockey = jockeyRepository.findById(dto.getJockeyId())
                .orElseThrow(() -> new ResourceNotFoundException("Jockey not found with id: " + dto.getJockeyId()));

        if ("INACTIVE".equalsIgnoreCase(jockey.getStatus())) {
            throw new BadRequestException("Jockey '" + jockey.getName() + "' is INACTIVE and cannot be registered");
        }

        // 4. Prevent duplicate registration of same horse in same race
        if (registrationRepository.existsByRaceRaceIdAndHorseHorseId(dto.getRaceId(), dto.getHorseId())) {
            throw new BadRequestException("Horse '" + horse.getName() + "' is already registered for this race");
        }

        Registration registration = Registration.builder()
                .race(race)
                .horse(horse)
                .jockey(jockey)
                .status("REGISTERED")
                .build();

        Registration savedRegistration = registrationRepository.save(registration);
        return mapToDTO(savedRegistration);
    }

    public void deleteRegistration(Long id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));
        registrationRepository.delete(registration);
    }

    private RegistrationDTO mapToDTO(Registration reg) {
        return RegistrationDTO.builder()
                .registrationId(reg.getRegistrationId())
                .raceId(reg.getRace().getRaceId())
                .raceName(reg.getRace().getRaceName())
                .horseId(reg.getHorse().getHorseId())
                .horseName(reg.getHorse().getName())
                .horseBreed(reg.getHorse().getBreed())
                .jockeyId(reg.getJockey().getJockeyId())
                .jockeyName(reg.getJockey().getName())
                .registrationDate(reg.getRegistrationDate())
                .status(reg.getStatus())
                .build();
    }
}
