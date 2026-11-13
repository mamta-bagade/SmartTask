package com.smarttask.service;

import com.smarttask.dto.TaskDtos.*;
import com.smarttask.entity.Project;
import com.smarttask.entity.Task;
import com.smarttask.entity.User;
import com.smarttask.repository.TaskRepository;
import com.smarttask.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService; // ProjectService inject kela

    public TaskService(TaskRepository taskRepository, 
                       UserRepository userRepository,
                       ProjectService projectService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectService = projectService;
    }

    public List<Response> getTasksByProject(Long projectId, String username) {
        
        Project project = projectService.verifyProjectAccess(projectId, username);
        User currentUser = userRepository.findByUsername(username).orElseThrow();

        List<Task> allTasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);

        
        if (project.getOwner().getId().equals(currentUser.getId())) {
            return allTasks.stream().map(this::mapToResponse).collect(Collectors.toList());
        }

        
        return allTasks.stream()
                .filter(t -> t.getAssignedTo() != null && t.getAssignedTo().getId().equals(currentUser.getId()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Response createTask(CreateRequest request, String username) {
        Project project = projectService.verifyProjectAccess(request.getProjectId(), username);

        User assignee = null;
        if (request.getAssignedToId() != null) {
            assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM)
                .status(request.getStatus() != null ? request.getStatus() : Task.Status.TODO)
                .dueDate(request.getDueDate())
                .project(project)
                .assignedTo(assignee)
                .build();

        return mapToResponse(taskRepository.save(task));
    }

    public Response updateTask(Long taskId, UpdateRequest request, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        projectService.verifyProjectAccess(task.getProject().getId(), username);

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        
        if (request.getAssignedToId() != null) {
             User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
             task.setAssignedTo(assignee);
        }

        return mapToResponse(taskRepository.save(task));
    }

    public void deleteTask(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        projectService.verifyProjectAccess(task.getProject().getId(), username);
        taskRepository.delete(task);
    }

    private Response mapToResponse(Task task) {
        Response response = new Response();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus().name());
        response.setPriority(task.getPriority().name());
        response.setDueDate(task.getDueDate());
        response.setProjectId(task.getProject().getId());
        
        if (task.getAssignedTo() != null) {
            response.setAssignedToId(task.getAssignedTo().getId());
            response.setAssignedToName(task.getAssignedTo().getUsername());
        }
        
        response.setCreatedAt(task.getCreatedAt());
        return response;
    }
}