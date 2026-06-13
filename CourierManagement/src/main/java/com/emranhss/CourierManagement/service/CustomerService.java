package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.response.CustomerResponseDTO;
import com.emranhss.CourierManagement.dto.request.CustomerRequestDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CustomerService {

    CustomerResponseDTO create(CustomerRequestDTO dto, MultipartFile image);

    List<CustomerResponseDTO> getAll();

    CustomerResponseDTO getById(Long id);

    CustomerResponseDTO update(Long id, CustomerRequestDTO dto, MultipartFile image);

    void delete(Long id);

}
