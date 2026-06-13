package com.emranhss.CourierManagement.service;

import com.emranhss.CourierManagement.dto.response.AgentResponseDTO;
import com.emranhss.CourierManagement.dto.response.ParcelResponseDTO;
import com.emranhss.CourierManagement.dto.request.AgentParcelRequestDTO;
import com.emranhss.CourierManagement.dto.request.AgentRequestDTO;
import com.emranhss.CourierManagement.dto.request.StatusUpdateRequestDTO;
import com.emranhss.CourierManagement.enums.ParcelStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface AgentService {

    // ── Agent management ──────────────────────────────────────────
    AgentResponseDTO create(AgentRequestDTO dto, MultipartFile image);

    List<AgentResponseDTO> getAll();

    AgentResponseDTO getById(Long id);

    List<AgentResponseDTO> getByHub(Long hubId);

    AgentResponseDTO update(Long id, AgentRequestDTO dto, MultipartFile image);

    void delete(Long id);

    // ── Hub parcel operations ─────────────────────────────────────

    // Agent books a parcel at hub counter for a walk-in sender
    ParcelResponseDTO bookParcel(AgentParcelRequestDTO dto);

    // Agent sees all parcels passing through their hub
    List<ParcelResponseDTO> getHubParcels(Long agentId);

    // Agent sees hub parcels filtered by status
    List<ParcelResponseDTO> getHubParcelsByStatus(Long agentId, ParcelStatus status);

    // Agent updates status of a parcel at their hub
    // (e.g. marks IN_TRANSIT when parcel leaves hub)
    ParcelResponseDTO updateParcelStatus(Long agentId, Long parcelId,
                                         StatusUpdateRequestDTO dto);

}
