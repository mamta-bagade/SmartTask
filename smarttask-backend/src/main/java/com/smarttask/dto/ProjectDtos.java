package com.smarttask.dto;

import lombok.Data;
import java.time.LocalDateTime;

public class ProjectDtos {

    @Data
    public static class CreateRequest {
        private String name;
        private String description;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private String ownerName;
        private LocalDateTime createdAt;
    }
     @Data
    public static class AddMemberRequest {
        private String email;
    }

    @Data
    public static class MemberResponse {
        private Long id;
        private String username;
        private String email;
    }
}