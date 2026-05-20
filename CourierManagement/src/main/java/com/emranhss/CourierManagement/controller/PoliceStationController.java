package com.emranhss.CourierManagement.controller;


import com.emranhss.CourierManagement.entity.PoliceStation;
import com.emranhss.CourierManagement.service.PoliceStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policeStation/")
public class PoliceStationController {

    @Autowired
    private PoliceStationService policeStationService;

    @PostMapping
    public ResponseEntity<PoliceStation> save(@RequestBody PoliceStation pk) {

        PoliceStation savedPoliceStation = policeStationService.saveOrUpdate(pk);
        return new ResponseEntity<>(savedPoliceStation, HttpStatus.CREATED);
    }


    @GetMapping
    public List<PoliceStation> getAll() {
        return policeStationService.getAll();
    }


}
