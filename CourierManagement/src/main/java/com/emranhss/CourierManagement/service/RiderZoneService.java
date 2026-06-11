package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.Response.PoliceStationResponseDTO;
import com.emranhss.CourierManagement.dto.Response.RiderResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public interface RiderZoneService {

    // Add one or more thanas to a rider's zone list
    RiderResponseDTO addZones(Long riderId, Set<Long> policeStationIds);

    // Remove one or more thanas from a rider's zone list
    RiderResponseDTO removeZones(Long riderId, Set<Long> policeStationIds);

    // Replace all zones at once (full sync)
    RiderResponseDTO setZones(Long riderId, Set<Long> policeStationIds);

    // Get all zones (thanas) assigned to a rider
    List<PoliceStationResponseDTO> getZonesForRider(Long riderId);

    // Get all riders who cover a specific police station
    List<RiderResponseDTO> getRidersForPoliceStation(Long policeStationId);

    // Get active riders who cover a specific police station (for assignment)
    List<RiderResponseDTO> getActiveRidersForPoliceStation(Long policeStationId);
}