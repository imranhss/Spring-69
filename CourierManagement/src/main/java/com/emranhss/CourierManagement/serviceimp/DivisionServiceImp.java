package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.dto.DivisionDTO;
import com.emranhss.CourierManagement.entity.Country;
import com.emranhss.CourierManagement.entity.Division;
import com.emranhss.CourierManagement.repository.CountryRepository;
import com.emranhss.CourierManagement.repository.DivisionRepository;
import com.emranhss.CourierManagement.service.DivisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DivisionServiceImp implements DivisionService {

    @Autowired
    private DivisionRepository divisionRepository;

    @Autowired
    private CountryRepository countryRepository;



    @Override
    public Division save(Division d) {

        Long countryId = d.getCountry().getId();
        Country c = countryRepository.findById(countryId)
                .orElseThrow(()-> new RuntimeException("Country not found with this ID"));

        d.setCountry(c);
        return divisionRepository.save(d);
    }

    @Override
    public List<Division> findAll() {
        return divisionRepository.findAll();
    }

    @Override
    public Optional<Division> getById(Long id) {
        return divisionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        divisionRepository.deleteById(id);
    }

    @Override
    public List<DivisionDTO> getDivisionsByCountryId(Long countryId) {

        List<Division> list = divisionRepository.findByCountryId(countryId);

        return  list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<DivisionDTO> getDivisionsByCountryName(String countryName) {

        List<Division> list = divisionRepository.findByCountryName(countryName);

        return  list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }


    private DivisionDTO convertToDTO(Division division) {

        return new DivisionDTO(
                division.getId(),
                division.getName(),
                division.getCountry().getName(),
                division.getCountry().getId()
        );
    }


}
