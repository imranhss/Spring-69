package com.emranhss.CourierManagement.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${image.upload.dir}")
    private String uploadDir;


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String path = Paths.get(uploadDir).toUri().toString();

        registry.addResourceHandler("/images/**")
                .addResourceLocations(path);


    }

}
