package com.smarttask.controller;


import com.smarttask.dto.ProjectDtos.*;
import com.smarttask.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<Response>> getMyProjects(Authentication auth) {
        return ResponseEntity.ok(projectService.getMyProjects(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<Response> createProject(@RequestBody CreateRequest request, Authentication auth) {
        return ResponseEntity.ok(projectService.createProject(request, auth.getName()));
    }

   
    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable Long id, @RequestBody AddMemberRequest request, Authentication auth) {
        return ResponseEntity.ok(Map.of("message", projectService.addMember(id, request, auth.getName())));
    }

    
    @GetMapping("/{id}/members")
    public ResponseEntity<List<MemberResponse>> getMembers(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(projectService.getMembers(id, auth.getName()));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, Authentication auth) {
        projectService.deleteProject(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}