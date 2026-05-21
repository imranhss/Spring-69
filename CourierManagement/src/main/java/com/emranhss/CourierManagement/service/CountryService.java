package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.entity.Country;
import com.emranhss.CourierManagement.entity.Division;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface CountryService {

    Country save(Country c);
    List<Country> findAll();
    Optional<Country> getById(Integer id);
    void delete(Integer id);


}
