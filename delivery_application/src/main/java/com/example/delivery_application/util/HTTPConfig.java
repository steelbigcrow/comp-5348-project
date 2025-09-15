package com.example.delivery_application.util;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class HTTPConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
