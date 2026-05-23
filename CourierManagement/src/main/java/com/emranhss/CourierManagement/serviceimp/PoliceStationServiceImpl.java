package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.dto.Response.DistrictResponseDTO;
import com.emranhss.CourierManagement.dto.Response.PoliceStationResponseDTO;
import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.PoliceStation;
import com.emranhss.CourierManagement.repository.DistrictRepository;
import com.emranhss.CourierManagement.repository.PoliceStationRepository;
import com.emranhss.CourierManagement.service.PoliceStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PoliceStationServiceImpl implements PoliceStationService {

    @Autowired
    private PoliceStationRepository stationRepository;

    @Autowired
    private DistrictRepository districtRepository;



    @Override
    public PoliceStation save(PoliceStation p) {
        Integer districtId= p.getDistrict().getId();
        District d= districtRepository.findById(districtId)
                .orElseThrow(()-> new RuntimeException("District Not found with this ID"));

         p.setDistrict(d);

        return stationRepository.save(p);
    }

    @Override
    public List<PoliceStation> findAll() {
        return stationRepository.findAll();
    }

    @Override
    public Optional<PoliceStation> getById(Long id) {
        return stationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        stationRepository.deleteById(id);
    }

    @Override
    public List<PoliceStationResponseDTO> findByDistrictId(Integer districtId) {
        List<PoliceStation> list= stationRepository.findByDistrictId(districtId);
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }



    @Override
    public List<PoliceStationResponseDTO> findByDistrictName(String districtName) {
        List<PoliceStation> list= stationRepository.findByDistrictName(districtName);
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }


    private PoliceStationResponseDTO convertToDTO(PoliceStation p) {

        return new PoliceStationResponseDTO(
                p.getId(),
                p.getName(),
                p.getDistrict().getId(),
                p.getDistrict().getName(),
                p.getDistrict().getDivision().getId(),
                p.getDistrict().getDivision().getName(),
                p.getDistrict().getDivision().getCountry().getName(),
                p.getDistrict().getDivision().getCountry().getCode(),
                p.getDistrict().getDivision().getCountry().getId()
        );
    }

}
