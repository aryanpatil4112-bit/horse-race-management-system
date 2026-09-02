package com.horserace.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultDTO {
    private Long resultId;

    @NotNull(message = "Race ID is required")
    private Long raceId;
    private String raceName;

    @NotNull(message = "Horse ID is required")
    private Long horseId;
    private String horseName;

    @NotNull(message = "Jockey ID is required")
    private Long jockeyId;
    private String jockeyName;

    @NotNull(message = "Position is required")
    @Min(value = 1, message = "Position must be 1 or greater")
    private Integer position;

    @NotBlank(message = "Finish time is required")
    private String finishTime;
}
