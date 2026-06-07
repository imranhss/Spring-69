package com.emranhss.CourierManagement.controller;

import com.emranhss.CourierManagement.dto.DivisionDTO;
import com.emranhss.CourierManagement.entity.Division;
import com.emranhss.CourierManagement.service.DivisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/division/")
public class DivisionController {

    @Autowired
    private DivisionService divisionService;

    @PostMapping
    public ResponseEntity<Division> save(@RequestBody Division d){
        Division savedDivision = divisionService.save(d);
        return  ResponseEntity.ok(savedDivision);

    }
    @GetMapping
    public  ResponseEntity<List<Division>> getAll(){

        List<Division> list = divisionService.findAll();
        return  ResponseEntity.ok(list);
    }


    // Find by Country ID
    @GetMapping("country/{id}")
    public List<DivisionDTO> getByCountryId(@PathVariable Long id) {
        return divisionService.getDivisionsByCountryId(id);
    }

    // Find by Country Name
    @GetMapping("country/name/{name}")
    public List<DivisionDTO> getByCountryName(@PathVariable String name) {
        return divisionService.getDivisionsByCountryName(name);
    }


}
