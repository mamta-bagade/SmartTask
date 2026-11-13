package com.smarttask.repository;

import com.smarttask.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
     @Query("SELECT DISTINCT p FROM Project p LEFT JOIN ProjectMember pm ON pm.project = p WHERE p.owner.id = :userId OR pm.user.id = :userId ORDER BY p.createdAt DESC")
    List<Project> findAllProjectsForUser(@Param("userId") Long userId);
}
