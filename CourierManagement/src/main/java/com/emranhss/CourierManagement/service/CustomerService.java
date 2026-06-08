package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.Response.CustomerResponseDTO;
import com.emranhss.CourierManagement.dto.request.CustomerRequestDTO;
import com.emranhss.CourierManagement.entity.Customer;
import com.emranhss.CourierManagement.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface CustomerService {

    CustomerResponseDTO create(CustomerRequestDTO dto, MultipartFile image);

    List<CustomerResponseDTO> getAll();

    CustomerResponseDTO getById(Long id);

    CustomerResponseDTO update(Long id, CustomerRequestDTO dto, MultipartFile image);

    void delete(Long id);

}
