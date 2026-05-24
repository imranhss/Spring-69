package com.emranhss.CourierManagement.controller;

import com.emranhss.CourierManagement.entity.Customer;
import com.emranhss.CourierManagement.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer/")
public class CustomerController {

    @Autowired
    private CustomerService customerService;


    @PostMapping
    public ResponseEntity<Customer> save(@RequestBody Customer c) {
        Customer savedCustomer = customerService.save(c);
        return ResponseEntity.ok(savedCustomer);

    }

}
