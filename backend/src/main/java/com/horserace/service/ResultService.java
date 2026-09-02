package com.horserace.service;

import com.horserace.dto.ResultDTO;
import com.horserace.entity.*;
import com.horserace.exception.BadRequestException;
import com.horserace.exception.ResourceNotFoundException;
import com.horserace.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final RaceRepository raceRepository;
    private final HorseRepository horseRepository;
    private final JockeyRepository jockeyRepository;
    private final RegistrationRepository registrationRepository;

    public ResultService(ResultRepository resultRepository,
                         RaceRepository raceRepository,
                         HorseRepository horseRepository,
                         JockeyRepository jockeyRepository,
                         RegistrationRepository registrationRepository) {
        this.resultRepository = resultRepository;
        this.raceRepository = raceRepository;
        this.horseRepository = horseRepository;
        this.jockeyRepository = jockeyRepository;
        this.registrationRepository = registrationRepository;
    }

    public List<ResultDTO> getResultsByRace(Long raceId) {
        List<Result> results;
        if (raceId != null) {
            results = resultRepository.findByRaceRaceIdOrderByPositionAsc(raceId);
        } else {
            results = resultRepository.findAll();
        }
        return results.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ResultDTO getResultById(Long id) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + id));
        return mapToDTO(result);
    }

    public ResultDTO recordResult(ResultDTO dto) {
        // 1. Check Race existence
        Race race = raceRepository.findById(dto.getRaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Race not found with id: " + dto.getRaceId()));

        // 2. Check Horse existence
        Horse horse = horseRepository.findById(dto.getHorseId())
                .orElseThrow(() -> new ResourceNotFoundException("Horse not found with id: " + dto.getHorseId()));

        // 3. Check Jockey existence
        Jockey jockey = jockeyRepository.findById(dto.getJockeyId())
                .orElseThrow(() -> new ResourceNotFoundException("Jockey not found with id: " + dto.getJockeyId()));

        // 4. Verify participant registered for race
        if (!registrationRepository.existsByRaceRaceIdAndHorseHorseId(dto.getRaceId(), dto.getHorseId())) {
            throw new BadRequestException("Horse '" + horse.getName() + "' is not registered for race '" + race.getRaceName() + "'");
        }

        // 5. Check duplicate position for race
        if (resultRepository.existsByRaceRaceIdAndPosition(dto.getRaceId(), dto.getPosition())) {
            throw new BadRequestException("Position " + dto.getPosition() + " is already recorded for this race");
        }

        // 6. Check duplicate horse result for race
        if (resultRepository.existsByRaceRaceIdAndHorseHorseId(dto.getRaceId(), dto.getHorseId())) {
            throw new BadRequestException("Result for horse '" + horse.getName() + "' is already recorded in this race");
        }

        Result result = Result.builder()
                .race(race)
                .horse(horse)
                .jockey(jockey)
                .position(dto.getPosition())
                .finishTime(dto.getFinishTime())
                .build();

        Result savedResult = resultRepository.save(result);

        // Automatically update race status to COMPLETED if not already
        if (race.getStatus() != RaceStatus.COMPLETED) {
            race.setStatus(RaceStatus.COMPLETED);
            raceRepository.save(race);
        }

        return mapToDTO(savedResult);
    }

    public void deleteResult(Long id) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + id));
        resultRepository.delete(result);
    }

    private ResultDTO mapToDTO(Result res) {
        return ResultDTO.builder()
                .resultId(res.getResultId())
                .raceId(res.getRace().getRaceId())
                .raceName(res.getRace().getRaceName())
                .horseId(res.getHorse().getHorseId())
                .horseName(res.getHorse().getName())
                .jockeyId(res.getJockey().getJockeyId())
                .jockeyName(res.getJockey().getName())
                .position(res.getPosition())
                .finishTime(res.getFinishTime())
                .build();
    }
}
