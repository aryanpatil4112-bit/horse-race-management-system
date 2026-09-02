package com.horserace.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HorseDTO {
    private Long horseId;

    @NotBlank(message = "Horse name is required")
    private String name;

    @NotBlank(message = "Breed is required")
    private String breed;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be at least 1")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String status; // ACTIVE, INACTIVE
}
