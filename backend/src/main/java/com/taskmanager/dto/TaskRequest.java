package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String status = "PENDING";

    private String priority = "MEDIUM";

    private LocalDate deadline;

    public TaskRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
}
