package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.Response.ParcelResponseDTO;
import com.emranhss.CourierManagement.dto.request.ParcelRequestDTO;
import com.emranhss.CourierManagement.dto.request.StatusUpdateRequestDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ParcelService {

    ParcelResponseDTO book(ParcelRequestDTO dto);

    List<ParcelResponseDTO> getByCustomer(Long customerId);

    ParcelResponseDTO track(String trackingCode);

    ParcelResponseDTO cancel(Long parcelId, Long customerId);

    List<ParcelResponseDTO> getAll();

    ParcelResponseDTO getById(Long id);

    List<ParcelResponseDTO> getPendingUnassigned();

    ParcelResponseDTO assignRider(Long parcelId, Long riderId);

    ParcelResponseDTO updateStatus(Long parcelId, StatusUpdateRequestDTO dto);

    void delete(Long id);

    double calculateCharge(double weight, String serviceType, double codAmount);
}
