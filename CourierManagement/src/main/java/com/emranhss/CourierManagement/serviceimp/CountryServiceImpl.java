package com.emranhss.CourierManagement.serviceimp;


import com.emranhss.CourierManagement.entity.Country;
import com.emranhss.CourierManagement.entity.Division;
import com.emranhss.CourierManagement.repository.CountryRepository;
import com.emranhss.CourierManagement.service.CountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CountryServiceImpl implements CountryService {

    @Autowired
    private CountryRepository countryRepository;

    @Override
    public Country save(Country c) {
        return countryRepository.save(c);
    }

    @Override
    public List<Country> findAll() {
        return countryRepository.findAll();
    }

    @Override
    public Optional<Country> getById(Integer id) {
        return countryRepository.findById(id);
    }

    @Override
    public void delete(Integer id) {

        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country Not Found With ID: " + id));

        countryRepository.delete(country);
    }


}
