package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.response.AgentResponseDTO;
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

    RiderResponseDTO getByUserId(Long id);


    // ── Zone / coverage queries ────────────────────────────────────

    /** All riders covering a specific police station */
    List<RiderResponseDTO> getByPoliceStation(Long policeStationId);

    /** Only active riders covering a specific police station */
    List<RiderResponseDTO> getActiveByPoliceStation(Long policeStationId);

    /** Riders covering any police station in a given district */
    List<RiderResponseDTO> getByDistrict(Long districtId);

    /** Only active riders covering any police station in a given district */
    List<RiderResponseDTO> getActiveByDistrict(Long districtId);

    // ── Status toggle ─────────────────────────────────────────────

    /** Activate or deactivate a rider */
    RiderResponseDTO setActive(Long id, boolean active);



}
