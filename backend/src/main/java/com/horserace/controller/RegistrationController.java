package com.horserace.controller;

import com.horserace.dto.ApiResponse;
import com.horserace.dto.RegistrationDTO;
import com.horserace.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RegistrationDTO>>> getAllRegistrations(
            @RequestParam(required = false) Long raceId) {
        List<RegistrationDTO> registrations = registrationService.getAllRegistrations(raceId);
        return ResponseEntity.ok(ApiResponse.ok("Registrations retrieved successfully", registrations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RegistrationDTO>> getRegistrationById(@PathVariable Long id) {
        RegistrationDTO registration = registrationService.getRegistrationById(id);
        return ResponseEntity.ok(ApiResponse.ok(registration));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationDTO>> registerParticipant(@Valid @RequestBody RegistrationDTO dto) {
        RegistrationDTO created = registrationService.registerParticipant(dto);
        return new ResponseEntity<>(ApiResponse.ok("Participant registered successfully", created), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRegistration(@PathVariable Long id) {
        registrationService.deleteRegistration(id);
        return ResponseEntity.ok(ApiResponse.ok("Registration cancelled successfully", null));
    }
}
