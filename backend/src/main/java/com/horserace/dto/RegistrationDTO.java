package com.horserace.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationDTO {
    private Long registrationId;

    @NotNull(message = "Race ID is required")
    private Long raceId;
    private String raceName;

    @NotNull(message = "Horse ID is required")
    private Long horseId;
    private String horseName;
    private String horseBreed;

    @NotNull(message = "Jockey ID is required")
    private Long jockeyId;
    private String jockeyName;

    private LocalDateTime registrationDate;
    private String status; // REGISTERED, CANCELLED
}
