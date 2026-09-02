package com.horserace.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JockeyDTO {
    private Long jockeyId;

    @NotBlank(message = "Jockey name is required")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 16, message = "Age must be at least 16")
    private Integer age;

    @NotNull(message = "Experience is required")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;

    private String status; // ACTIVE, INACTIVE
}
