package com.smarttask.controller;

import com.smarttask.dto.TaskDtos.*;
import com.smarttask.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<Response>> getTasks(@RequestParam Long projectId, Authentication auth) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId, auth.getName()));
    }

    @PostMapping
    public ResponseEntity<Response> createTask(@RequestBody CreateRequest request, Authentication auth) {
        return ResponseEntity.ok(taskService.createTask(request, auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response> updateTask(@PathVariable Long id, @RequestBody UpdateRequest request, Authentication auth) {
        return ResponseEntity.ok(taskService.updateTask(id, request, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication auth) {
        taskService.deleteTask(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}