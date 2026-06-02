package com.emranhss.CourierManagement.controller;

import com.emranhss.CourierManagement.entity.Customer;
import com.emranhss.CourierManagement.entity.Rider;
import com.emranhss.CourierManagement.service.RiderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rider/")
public class RiderController {

    @Autowired
    private RiderService riderService;


    @PostMapping
    public ResponseEntity<Map<String, String>> save(
            @RequestPart(value = "rider") String data,
            @RequestParam(value = "image") MultipartFile file
    ) {

        ObjectMapper objectMapper = new ObjectMapper();
        Rider ri = objectMapper.readValue(data, Rider.class);

        try {
            riderService.save(ri, file);
            Map<String, String> response = new HashMap<>();
            response.put("Message", "Rider Added Successfully ");

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("Message", "Rider Add Faild " + e);
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }


}
