package com.example.demo.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.nio.charset.StandardCharsets;
import java.io.IOException;

@RestController
public class HomeController {

    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    @GetMapping(value = {"/", "/home", "/friends", "/notifications", "/settings"}, produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> home() {
        try {
            Resource resource = new ClassPathResource("static/index.html");
            if (resource.exists()) {
                String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
                logger.info("Successfully serving index.html for React SPA");
                return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(content);
            } else {
                logger.error("index.html not found in static resources");
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("<h1>Error: React app not found</h1>");
            }
        } catch (IOException e) {
            logger.error("Error reading index.html: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("<h1>Error loading React app</h1>");
        }
    }
}
