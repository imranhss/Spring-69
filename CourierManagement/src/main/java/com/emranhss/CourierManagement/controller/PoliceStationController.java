package com.emranhss.CourierManagement.controller;


import com.emranhss.CourierManagement.dto.Response.DistrictResponseDTO;
import com.emranhss.CourierManagement.dto.Response.PoliceStationResponseDTO;
import com.emranhss.CourierManagement.entity.PoliceStation;
import com.emranhss.CourierManagement.service.PoliceStationService;
import com.emranhss.CourierManagement.serviceimp.PoliceStationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policeStation/")
@CrossOrigin("*")
public class PoliceStationController {

    @Autowired
    private PoliceStationService policeStationService;

    @PostMapping
    public ResponseEntity<PoliceStation> save(@RequestBody PoliceStation pk) {

        PoliceStation savedPoliceStation = policeStationService.save(pk);
        return new ResponseEntity<>(savedPoliceStation, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<PoliceStation>> getAll() {
        List<PoliceStation> list = policeStationService.findAll();
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


    @PutMapping("{id}")
    public ResponseEntity<PoliceStation> update(
            @PathVariable Long id,
            @RequestBody PoliceStation policeStation) {

        policeStation.setId(id);

        PoliceStation updatedPoliceStation =
                policeStationService.save(policeStation);

        return ResponseEntity.ok(updatedPoliceStation);
    }


    @GetMapping("district/{id}")
    public ResponseEntity<List<PoliceStationResponseDTO>> getByDistrictId(@PathVariable Long id) {
        List<PoliceStationResponseDTO> list = policeStationService.findByDistrictId(id);
        return ResponseEntity.ok(list);
    }
 
    @GetMapping("district/name/{name}")
    public ResponseEntity<List<PoliceStationResponseDTO>> getByCountryName(@PathVariable String name) {
        List<PoliceStationResponseDTO> list = policeStationService.findByDistrictName(name);
        return ResponseEntity.ok(list);
    }


}
