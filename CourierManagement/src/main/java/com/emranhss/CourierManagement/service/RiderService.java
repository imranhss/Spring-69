package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.Rider;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface RiderService {

    Rider save(Rider r, MultipartFile image);
    List<Rider> findAll();
    Optional<Rider> getById(Integer id);
    void delete(Integer id);


}
