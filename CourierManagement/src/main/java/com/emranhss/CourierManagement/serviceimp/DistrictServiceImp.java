package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.Division;
import com.emranhss.CourierManagement.repository.DistrictRepository;
import com.emranhss.CourierManagement.repository.DivisionRepository;
import com.emranhss.CourierManagement.service.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DistrictServiceImp implements DistrictService {

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private DivisionRepository divisionRepository;


    @Override
    public District save(District d) {
        Integer divisionId= d.getDivision().getId();
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
    public Optional<District> getById(Integer id) {
        return districtRepository.findById(id);
    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public List<District> findByDivisionId(Integer divisionId) {
        return districtRepository.findByDivisionId(divisionId);
    }

    @Override
    public List<District> findByDivisionName(String divisionName) {
        return districtRepository.findByDivisionName(divisionName);
    }
}
