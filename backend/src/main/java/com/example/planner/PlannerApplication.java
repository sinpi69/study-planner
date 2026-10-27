package com.example.planner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class PlannerApplication {
    public static void main(String[] args) {
        // Postgres rejects the legacy "Asia/Calcutta" id that some Windows JVMs report
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(PlannerApplication.class, args);
    }
}
