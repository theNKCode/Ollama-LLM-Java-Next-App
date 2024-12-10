//package com.example.ollama_llm;
//
//import org.springframework.ai.chat.messages.UserMessage;
//import org.springframework.ai.chat.model.ChatResponse;
//import org.springframework.ai.chat.prompt.Prompt;
//import org.springframework.ai.ollama.OllamaChatModel;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import reactor.core.publisher.Flux;
//
//import java.util.Map;
//
//@RestController
//public class ChatController {
//
//    private final OllamaChatModel chatModel;
//
//    @Autowired
//    public ChatController(OllamaChatModel chatModel) {
//        this.chatModel = chatModel;
//    }
//
//    @GetMapping("/ai/generate")
//    public Map<String,String> generate(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
//        return Map.of("generation", this.chatModel.call(message));
//    }
//
//    @GetMapping("/ai/generateStream")
//    public Flux<ChatResponse> generateStream(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
//        Prompt prompt = new Prompt(new UserMessage(message));
//        return this.chatModel.stream(prompt);
//    }
//
//}

package com.example.ollama_llm;

import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class ChatController {

    private final OllamaChatModel chatModel;
    private final PromptRepository promptRepository;

    @Autowired
    public ChatController(OllamaChatModel chatModel, PromptRepository promptRepository) {
        this.chatModel = chatModel;
        this.promptRepository = promptRepository;
    }

    @GetMapping("/generate")
    public Map<String, String> generate(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
        String response = this.chatModel.call(message);

        // Save prompt and response to database
        PromptEntity promptEntity = new PromptEntity();
        promptEntity.setMessage(message);
        promptEntity.setResponse(response);
        promptRepository.save(promptEntity);

        return Map.of("generation", response);
    }

    @GetMapping("/messages")
    public List<PromptEntity> getAllMessages() {
        return promptRepository.findAll();
    }
}
