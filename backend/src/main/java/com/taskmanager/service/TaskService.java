package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.model.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final Map<Long, Task> taskStore = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public List<Task> getAllTasks() {
        return taskStore.values().stream()
                .sorted(Comparator.comparing(Task::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public Optional<Task> getTaskById(Long id) {
        return Optional.ofNullable(taskStore.get(id));
    }

    public Task createTask(TaskRequest request) {
        Long id = idCounter.getAndIncrement();
        Task task = new Task();
        task.setId(id);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
        task.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        task.setDeadline(request.getDeadline());
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        taskStore.put(id, task);
        return task;
    }

    public Optional<Task> updateTask(Long id, TaskRequest request) {
        Task existingTask = taskStore.get(id);
        if (existingTask == null) {
            return Optional.empty();
        }
        existingTask.setTitle(request.getTitle());
        existingTask.setDescription(request.getDescription());
        if (request.getStatus() != null) existingTask.setStatus(request.getStatus());
        if (request.getPriority() != null) existingTask.setPriority(request.getPriority());
        existingTask.setDeadline(request.getDeadline());
        existingTask.setUpdatedAt(LocalDateTime.now());
        taskStore.put(id, existingTask);
        return Optional.of(existingTask);
    }

    public boolean completeTask(Long id) {
        Task task = taskStore.get(id);
        if (task == null) return false;
        task.setStatus("COMPLETED");
        task.setUpdatedAt(LocalDateTime.now());
        taskStore.put(id, task);
        return true;
    }

    public boolean deleteTask(Long id) {
        return taskStore.remove(id) != null;
    }

    public List<Task> getTasksByStatus(String status) {
        return taskStore.values().stream()
                .filter(t -> t.getStatus().equalsIgnoreCase(status))
                .sorted(Comparator.comparing(Task::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public Map<String, Object> getStats() {
        long total = taskStore.size();
        long pending = taskStore.values().stream().filter(t -> "PENDING".equals(t.getStatus())).count();
        long inProgress = taskStore.values().stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count();
        long completed = taskStore.values().stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("inProgress", inProgress);
        stats.put("completed", completed);
        return stats;
    }
}
