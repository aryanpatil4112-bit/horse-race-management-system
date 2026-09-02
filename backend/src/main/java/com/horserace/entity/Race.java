package com.horserace.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "races")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Race {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "race_id")
    private Long raceId;

    @Column(name = "race_name", nullable = false, length = 120)
    private String raceName;

    @Column(name = "race_date", nullable = false)
    private LocalDate raceDate;

    @Column(name = "race_time", nullable = false)
    private LocalTime raceTime;

    @Column(nullable = false, length = 120)
    private String location;

    @Column(nullable = false, length = 30)
    private String distance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RaceStatus status; // SCHEDULED, ONGOING, COMPLETED, CANCELLED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = RaceStatus.SCHEDULED;
        }
    }
}
