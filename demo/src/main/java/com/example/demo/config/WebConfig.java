package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String serverUrl = System.getenv("CORS_ALLOWED_ORIGINS");
        if (serverUrl == null) {
            serverUrl = "http://localhost:3000"; // 기본값
        }
        
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:8080", serverUrl)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
