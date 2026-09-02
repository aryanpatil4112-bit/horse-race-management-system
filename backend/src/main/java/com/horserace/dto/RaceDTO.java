package com.horserace.dto;

import com.horserace.entity.RaceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RaceDTO {
    private Long raceId;

    @NotBlank(message = "Race name is required")
    private String raceName;

    @NotNull(message = "Race date is required")
    private LocalDate raceDate;

    @NotNull(message = "Race time is required")
    private LocalTime raceTime;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Distance is required")
    private String distance;

    private RaceStatus status; // SCHEDULED, ONGOING, COMPLETED, CANCELLED
    private Integer participantCount;
}
