package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.dto.DivisionDTO;
import com.emranhss.CourierManagement.dto.Response.DistrictResponseDTO;
import com.emranhss.CourierManagement.dto.mapper.DistrictMapper;
import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.Division;
import com.emranhss.CourierManagement.repository.DistrictRepository;
import com.emranhss.CourierManagement.repository.DivisionRepository;
import com.emranhss.CourierManagement.service.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DistrictServiceImp implements DistrictService {

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private DivisionRepository divisionRepository;


    @Override
    public District save(District d) {
        Long divisionId= d.getDivision().getId();
        Division dv =divisionRepository.findById(divisionId)
                .orElseThrow(()-> new RuntimeException("Division Not found With this id"));

        d.setDivision(dv);
        return districtRepository.save(d);
    }

    @Override
    public List<District> findAll() {
        return districtRepository.findAll();
    }

    @Override
    public Optional<District> getById(Long id) {
        return districtRepository.findById(id);
    }

    @Override
    public void delete(Long id) {

    }

    @Override
    public List<DistrictResponseDTO> findByDivisionId(Long divisionId) {
        List<District> list =  districtRepository.findByDivisionId(divisionId);
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<DistrictResponseDTO> findByDivisionName(String divisionName) {
        List<District> list =  districtRepository.findByDivisionName(divisionName);
        return list.stream().map(DistrictMapper::toDTO).collect(Collectors.toList());
    }
    private DistrictResponseDTO convertToDTO(District district) {

        DistrictResponseDTO dto = new DistrictResponseDTO();

        dto.setId(district.getId());
        dto.setName(district.getName());
        dto.setDivisionId(district.getDivision().getId());
        dto.setDivisionName(district.getDivision().getName());
        dto.setCountryId(district.getDivision().getCountry().getId());
        dto.setCountryName(district.getDivision().getCountry().getName());
        dto.setCountryCode(district.getDivision().getCountry().getCode());


        return dto;
    }


}
