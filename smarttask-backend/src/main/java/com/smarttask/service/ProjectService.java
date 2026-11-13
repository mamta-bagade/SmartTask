
package com.smarttask.service;

import com.smarttask.dto.ProjectDtos.*;
import com.smarttask.entity.Project;
import com.smarttask.entity.ProjectMember;
import com.smarttask.entity.User;
import com.smarttask.repository.ProjectMemberRepository;
import com.smarttask.repository.ProjectRepository;
import com.smarttask.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository memberRepository;

    public ProjectService(ProjectRepository projectRepository, 
                          UserRepository userRepository, 
                          ProjectMemberRepository memberRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
    }

    public List<Response> getMyProjects(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        
        return projectRepository.findAllProjectsForUser(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Response createProject(CreateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(user)
                .build();

        return mapToResponse(projectRepository.save(project));
    }

    public String addMember(Long projectId, AddMemberRequest request, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        
        if (!project.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Only owner can add members");
        }

        User newUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No user found with this email"));

        if (memberRepository.existsByProjectIdAndUserId(projectId, newUser.getId())) {
            throw new RuntimeException("User is already a member of this project");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(newUser)
                .build();

        memberRepository.save(member);
        return "Member added successfully!";
    }

    public List<MemberResponse> getMembers(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = project.getOwner().getId().equals(user.getId());
        boolean isMember = memberRepository.existsByProjectIdAndUserId(projectId, user.getId());

        if (!isOwner && !isMember) {
            throw new RuntimeException("Access Denied");
        }

        return memberRepository.findByProjectId(projectId).stream().map(m -> {
            MemberResponse res = new MemberResponse();
            res.setId(m.getUser().getId());
            res.setUsername(m.getUser().getUsername());
            res.setEmail(m.getUser().getEmail());
            return res;
        }).collect(Collectors.toList());
    }

   
    public void deleteProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Only owner can delete this project");
        }

        
        projectRepository.delete(project);
    }

    
    public Project verifyProjectAccess(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        
        if (project.getOwner().getId().equals(user.getId())) {
            return project;
        }

        
        boolean isMember = memberRepository.existsByProjectIdAndUserId(projectId, user.getId());
        if (isMember) {
            return project;
        }

        throw new RuntimeException("Access Denied! You are not a member of this project.");
    }

    private Response mapToResponse(Project project) {
        Response response = new Response();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setOwnerName(project.getOwner().getUsername());
        response.setCreatedAt(project.getCreatedAt());
        return response;
    }
}