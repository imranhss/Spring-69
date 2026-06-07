package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.DivisionDTO;
import com.emranhss.CourierManagement.dto.Response.DistrictResponseDTO;
import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.Division;

import java.util.List;
import java.util.Optional;

public interface DistrictService {

    District save(District d);
    List<District> findAll();
    Optional<District> getById(Long id);
    void delete(Long id);

    List<DistrictResponseDTO> findByDivisionId(Long  divisionId);

    List<DistrictResponseDTO> findByDivisionName(String divisionName);


}
