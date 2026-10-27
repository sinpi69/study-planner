package com.example.planner;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long subjectId;

    @NotBlank
    private String title;

    @NotNull
    private LocalDate dueDate;

    private Integer estimatedMinutes;

    private boolean done;
}
