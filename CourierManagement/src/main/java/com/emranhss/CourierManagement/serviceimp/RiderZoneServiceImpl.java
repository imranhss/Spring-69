package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.dto.response.PoliceStationResponseDTO;
import com.emranhss.CourierManagement.dto.response.RiderResponseDTO;
import com.emranhss.CourierManagement.dto.mapper.GeoMapper;
import com.emranhss.CourierManagement.dto.mapper.RiderMapper;
import com.emranhss.CourierManagement.entity.PoliceStation;
import com.emranhss.CourierManagement.entity.Rider;
import com.emranhss.CourierManagement.repository.PoliceStationRepository;
import com.emranhss.CourierManagement.repository.RiderRepository;
import com.emranhss.CourierManagement.service.RiderZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RiderZoneServiceImpl implements RiderZoneService {

    private final RiderRepository riderRepository;
    private final PoliceStationRepository policeStationRepository;

    @Transactional
    @Override
    public RiderResponseDTO addZones(Long riderId, Set<Long> policeStationIds) {
        Rider rider = getRiderOrThrow(riderId);
        Set<PoliceStation> newZones = fetchPoliceStations(policeStationIds);
        rider.getZones().addAll(newZones);
        return RiderMapper.toDTO(riderRepository.save(rider));
    }

    @Transactional
    @Override
    public RiderResponseDTO removeZones(Long riderId, Set<Long> policeStationIds) {
        Rider rider = getRiderOrThrow(riderId);
        rider.getZones().removeIf(ps -> policeStationIds.contains(ps.getId()));
        return RiderMapper.toDTO(riderRepository.save(rider));
    }

    @Transactional
    @Override
    public RiderResponseDTO setZones(Long riderId, Set<Long> policeStationIds) {
        Rider rider = getRiderOrThrow(riderId);
        Set<PoliceStation> zones = fetchPoliceStations(policeStationIds);
        rider.setZones(zones);
        return RiderMapper.toDTO(riderRepository.save(rider));
    }

    @Override
    public List<PoliceStationResponseDTO> getZonesForRider(Long riderId) {
        Rider rider = getRiderOrThrow(riderId);
        return rider.getZones()
                .stream()
                .map(GeoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RiderResponseDTO> getRidersForPoliceStation(Long policeStationId) {
        return riderRepository.findByZonesId(policeStationId)
                .stream()
                .map(RiderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RiderResponseDTO> getActiveRidersForPoliceStation(Long policeStationId) {
        return riderRepository.findByZonesIdAndActiveTrue(policeStationId)
                .stream()
                .map(RiderMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ── Helpers ───────────────────────────────────────────────────

    private Rider getRiderOrThrow(Long riderId) {
        return riderRepository.findById(riderId)
                .orElseThrow(() -> new RuntimeException("Rider not found with id: " + riderId));
    }

    private Set<PoliceStation> fetchPoliceStations(Set<Long> ids) {
        Set<PoliceStation> stations = ids.stream()
                .map(id -> policeStationRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Police station not found with id: " + id)))
                .collect(Collectors.toSet());
        return stations;
    }
}

