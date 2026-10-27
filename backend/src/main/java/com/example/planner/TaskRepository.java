package com.example.planner;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    void deleteBySubjectId(Long subjectId);
}
