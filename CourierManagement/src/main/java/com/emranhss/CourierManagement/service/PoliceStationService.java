package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.response.PoliceStationResponseDTO;
import com.emranhss.CourierManagement.entity.PoliceStation;

import java.util.List;
import java.util.Optional;

public interface PoliceStationService {

    PoliceStation save(PoliceStation p);
    List<PoliceStation> findAll();
    Optional<PoliceStation> getById(Long id);
    void delete(Long id);

    List<PoliceStationResponseDTO> findByDistrictId(Long  districtId);

    List<PoliceStationResponseDTO> findByDistrictName(String districtName);


}
