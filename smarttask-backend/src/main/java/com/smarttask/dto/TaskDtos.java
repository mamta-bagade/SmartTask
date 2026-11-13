package com.smarttask.dto;

import com.smarttask.entity.Task;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDtos {

    @Data
    public static class CreateRequest {
        private String title;
        private String description;
        private Task.Priority priority;
        private Task.Status status;
        private LocalDate dueDate;
        private Long projectId;
        private Long assignedToId; 
    }

    @Data
    public static class UpdateRequest {
        private String title;
        private String description;
        private Task.Priority priority;
        private Task.Status status;
        private LocalDate dueDate;
        private Long assignedToId; 
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String status;
        private String priority;
        private LocalDate dueDate;
        private Long projectId;
        private Long assignedToId;
        private String assignedToName; 
        private LocalDateTime createdAt;
    }
}