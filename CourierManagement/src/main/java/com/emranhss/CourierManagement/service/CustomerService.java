package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.entity.Customer;
import com.emranhss.CourierManagement.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface CustomerService {

    Customer save(Customer c, MultipartFile file);
    List<Customer> findAll();
    Optional<Customer> getById(Long id);
    void delete(Long id);

}
