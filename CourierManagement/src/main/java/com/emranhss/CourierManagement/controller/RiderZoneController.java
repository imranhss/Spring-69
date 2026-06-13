package com.emranhss.CourierManagement.controller;

import com.emranhss.CourierManagement.dto.response.PoliceStationResponseDTO;
import com.emranhss.CourierManagement.dto.response.RiderResponseDTO;
import com.emranhss.CourierManagement.service.RiderZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/rider-zones")
@RequiredArgsConstructor
public class RiderZoneController {

    private final RiderZoneService riderZoneService;

    // Get all thanas assigned to a rider
    @GetMapping("/rider/{riderId}")
    public List<PoliceStationResponseDTO> getZonesForRider(@PathVariable Long riderId) {
        return riderZoneService.getZonesForRider(riderId);
    }

    // Get all riders who cover a specific thana
    @GetMapping("/police-station/{policeStationId}")
    public List<RiderResponseDTO> getRidersForPoliceStation(@PathVariable Long policeStationId) {
        return riderZoneService.getRidersForPoliceStation(policeStationId);
    }

    // Get only ACTIVE riders for a thana (used when assigning parcel)
    @GetMapping("/police-station/{policeStationId}/active")
    public List<RiderResponseDTO> getActiveRidersForPoliceStation(@PathVariable Long policeStationId) {
        return riderZoneService.getActiveRidersForPoliceStation(policeStationId);
    }

    // Add thanas to a rider (does not remove existing ones)
    @PostMapping("/rider/{riderId}/add")
    public RiderResponseDTO addZones(
            @PathVariable Long riderId,
            @RequestBody Set<Long> policeStationIds) {
        return riderZoneService.addZones(riderId, policeStationIds);
    }

    // Remove specific thanas from a rider
    @PostMapping("/rider/{riderId}/remove")
    public RiderResponseDTO removeZones(
            @PathVariable Long riderId,
            @RequestBody Set<Long> policeStationIds) {
        return riderZoneService.removeZones(riderId, policeStationIds);
    }

    // Replace ALL zones at once (full sync — useful for admin UI zone picker)
    @PutMapping("/rider/{riderId}")
    public RiderResponseDTO setZones(
            @PathVariable Long riderId,
            @RequestBody Set<Long> policeStationIds) {
        return riderZoneService.setZones(riderId, policeStationIds);
    }
}
