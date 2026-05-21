package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.DivisionDTO;
import com.emranhss.CourierManagement.entity.Country;
import com.emranhss.CourierManagement.entity.Division;

import java.util.List;
import java.util.Optional;

public interface DivisionService {

    Division save(Division d);
    List<Division> findAll();
    Optional<Division> getById(Integer id);
    void delete(Integer id);

    List<DivisionDTO> getDivisionsByCountryId(Integer countryId);

    List<DivisionDTO> getDivisionsByCountryName(String countryName);

}
