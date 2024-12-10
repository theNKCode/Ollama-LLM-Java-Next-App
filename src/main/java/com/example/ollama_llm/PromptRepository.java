package com.example.ollama_llm;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PromptRepository extends JpaRepository<PromptEntity, Long> {
}
