package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.response.RiderResponseDTO;
import com.emranhss.CourierManagement.dto.request.RiderRequestDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface RiderService {

    RiderResponseDTO create(RiderRequestDTO dto, MultipartFile image);

    List<RiderResponseDTO> getAll();

    RiderResponseDTO getById(Long id);

    void delete(Long id);


}
