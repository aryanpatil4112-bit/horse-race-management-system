package com.horserace.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jockeys")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Jockey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "jockey_id")
    private Long jockeyId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private Integer experience; // Experience in years

    @Column(nullable = false, length = 20)
    private String status; // ACTIVE, INACTIVE

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }
}
