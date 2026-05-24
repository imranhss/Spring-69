package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.entity.Customer;
import com.emranhss.CourierManagement.entity.User;

import java.util.List;
import java.util.Optional;

public interface CustomerService {

    Customer save(Customer c);
    List<Customer> findAll();
    Optional<Customer> getById(Long id);
    void delete(Long id);

}
