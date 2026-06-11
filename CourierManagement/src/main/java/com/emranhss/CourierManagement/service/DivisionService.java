package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.DivisionDTO;
import com.emranhss.CourierManagement.dto.Response.DivisionResponseDTO;
import com.emranhss.CourierManagement.entity.Country;
import com.emranhss.CourierManagement.entity.Division;

import java.util.List;
import java.util.Optional;

public interface DivisionService {

    Division save(Division d);
    List<Division> findAll();
    Optional<Division> getById(Long id);
    void delete(Long id);

    List<DivisionResponseDTO> getDivisionsByCountryId(Long countryId);

    List<DivisionResponseDTO> getDivisionsByCountryName(String countryName);

}
