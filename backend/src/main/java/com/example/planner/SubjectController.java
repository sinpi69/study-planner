package com.example.planner;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    private final SubjectRepository subjects;
    private final TaskRepository tasks;

    public SubjectController(SubjectRepository subjects, TaskRepository tasks) {
        this.subjects = subjects;
        this.tasks = tasks;
    }

    @GetMapping
    public List<Subject> list() {
        return subjects.findAll();
    }

    @PostMapping
    public Subject create(@Valid @RequestBody Subject body) {
        body.setId(null);
        return subjects.save(body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(@PathVariable Long id) {
        tasks.deleteBySubjectId(id);
        subjects.deleteById(id);
    }
}
