package com.horserace.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"race_id", "horse_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registration_id")
    private Long registrationId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "horse_id", nullable = false)
    private Horse horse;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "jockey_id", nullable = false)
    private Jockey jockey;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Column(nullable = false, length = 20)
    private String status; // REGISTERED, CANCELLED

    @PrePersist
    protected void onCreate() {
        if (this.registrationDate == null) {
            this.registrationDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "REGISTERED";
        }
    }
}
