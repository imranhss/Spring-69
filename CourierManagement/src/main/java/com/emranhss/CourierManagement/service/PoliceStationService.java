package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.entity.PoliceStation;
import com.emranhss.CourierManagement.repository.PoliceStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PoliceStationService {

    @Autowired
    private PoliceStationRepository stationRepository;

    public List<PoliceStation> getAll() {

        return stationRepository.findAll();
    }

    public PoliceStation saveOrUpdate(PoliceStation p) {

      return   stationRepository.save(p);
    }

    public Optional<PoliceStation> getById(long id) {
        return stationRepository.findById(id);
    }

    public  void  delete(long id){

         stationRepository.deleteById(id);
    }

}
