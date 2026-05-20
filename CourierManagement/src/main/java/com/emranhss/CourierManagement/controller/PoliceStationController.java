package com.emranhss.CourierManagement.controller;


import com.emranhss.CourierManagement.entity.PoliceStation;
import com.emranhss.CourierManagement.service.PoliceStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/policeStation/")
@CrossOrigin("*")
public class PoliceStationController {

    @Autowired
    private PoliceStationService policeStationService;

    @PostMapping
    public ResponseEntity<PoliceStation> save(@RequestBody PoliceStation pk) {

        PoliceStation savedPoliceStation = policeStationService.saveOrUpdate(pk);
        return new ResponseEntity<>(savedPoliceStation, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<PoliceStation>> getAll() {
        List<PoliceStation> list = policeStationService.getAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("{id}")
    public ResponseEntity<PoliceStation> getById(@PathVariable Long id) {

        PoliceStation policeStation =
                policeStationService.getById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Police Station Not Found"));

        return ResponseEntity.ok(policeStation);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteById(
            @PathVariable Long id) {

        policeStationService.delete(id);

        return ResponseEntity.ok(
                "Police Station Deleted Successfully"
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<PoliceStation> update(
            @PathVariable Long id,
            @RequestBody PoliceStation policeStation) {

        policeStation.setId(id);

        PoliceStation updatedPoliceStation =
                policeStationService.saveOrUpdate(policeStation);

        return ResponseEntity.ok(updatedPoliceStation);
    }


}
