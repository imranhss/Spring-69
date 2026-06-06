package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.Response.RiderResponseDTO;
import com.emranhss.CourierManagement.dto.request.RiderRequestDTO;
import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.Rider;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public interface RiderService {

    RiderResponseDTO create(RiderRequestDTO dto, MultipartFile image);

    List<RiderResponseDTO> getAll();

    RiderResponseDTO getById(Long id);

    void delete(Long id);


}
