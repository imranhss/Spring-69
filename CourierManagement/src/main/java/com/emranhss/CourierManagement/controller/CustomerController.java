package com.emranhss.CourierManagement.controller;

import com.emranhss.CourierManagement.dto.response.CustomerResponseDTO;
import com.emranhss.CourierManagement.dto.request.CustomerRequestDTO;
import com.emranhss.CourierManagement.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/customer/")
public class CustomerController {

    @Autowired
    private CustomerService customerService;


    @PostMapping
    public ResponseEntity<CustomerResponseDTO> create(
            @RequestPart("customer") String customerJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        CustomerRequestDTO dto = mapper.readValue(customerJson, CustomerRequestDTO.class);

        return new ResponseEntity<>(
                customerService.create(dto, image),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> getAll() {
        List<CustomerResponseDTO> list = customerService.getAll();
        return list.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public CustomerResponseDTO getById(@PathVariable Long id) {
        return customerService.getById(id);
    }

    @PutMapping("/{id}")
    public CustomerResponseDTO update(
            @PathVariable Long id,
            @RequestPart("customer") CustomerRequestDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return customerService.update(id, dto, image);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }

}




//{
//    "name":"Fatema Begum",
//        "email":"fatema@gmail.com",
//        "phone":"01933333333",
//        "password":"fatema123",
//        "address":"Dhaka",
//        "gender":"FEMALE",
//        "dob":"1995-08-21",
//        "policeStationId":1
//}