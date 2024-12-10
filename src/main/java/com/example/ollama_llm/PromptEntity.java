package com.example.ollama_llm;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prompts")
public class PromptEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String response;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }

    // Getters and Setters
    

    
}
