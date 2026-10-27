package com.example.planner;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository tasks;

    public TaskController(TaskRepository tasks) {
        this.tasks = tasks;
    }

    @GetMapping
    public List<Task> list() {
        return tasks.findAll();
    }

    @PostMapping
    public Task create(@Valid @RequestBody Task body) {
        body.setId(null);
        return tasks.save(body);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @Valid @RequestBody Task body) {
        Task task = tasks.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        task.setSubjectId(body.getSubjectId());
        task.setTitle(body.getTitle());
        task.setDueDate(body.getDueDate());
        task.setEstimatedMinutes(body.getEstimatedMinutes());
        task.setDone(body.isDone());
        return tasks.save(task);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        tasks.deleteById(id);
    }
}
