package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.model.Task;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(
            @RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(taskService.getTasksByStatus(status));
        }
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest request) {
        Task task = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id,
                                            @Valid @RequestBody TaskRequest request) {
        return taskService.updateTask(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Map<String, String>> completeTask(@PathVariable Long id) {
        boolean success = taskService.completeTask(id);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Task marked as completed"));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable Long id) {
        boolean success = taskService.deleteTask(id);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(taskService.getStats());
    }
}
