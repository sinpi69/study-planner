package com.example.planner;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/** Adds demo data on first start so the UI isn't empty. */
@Component
public class DataSeeder implements CommandLineRunner {
    private final SubjectRepository subjects;
    private final TaskRepository tasks;

    public DataSeeder(SubjectRepository subjects, TaskRepository tasks) {
        this.subjects = subjects;
        this.tasks = tasks;
    }

    @Override
    public void run(String... args) {
        if (subjects.count() > 0) return;

        Subject math = subject("Mathematics", "#2b59e0");
        Subject bio = subject("Biology", "#1f9d6b");
        Subject history = subject("History", "#c2762d");

        task(math, "Finish calculus problem set 4", -1, 90);
        task(bio, "Revise cell respiration notes", 1, 45);
        task(history, "Outline essay on the Industrial Revolution", 3, 60);
        task(math, "Practice past paper: probability", 6, 120);
        task(bio, "Prepare lab report", 12, 75);
    }

    private Subject subject(String name, String color) {
        Subject s = new Subject();
        s.setName(name);
        s.setColor(color);
        return subjects.save(s);
    }

    private void task(Subject subject, String title, int daysFromNow, int minutes) {
        Task t = new Task();
        t.setSubjectId(subject.getId());
        t.setTitle(title);
        t.setDueDate(LocalDate.now().plusDays(daysFromNow));
        t.setEstimatedMinutes(minutes);
        tasks.save(t);
    }
}
