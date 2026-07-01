package com.emranhss.CourierManagement.controller;

import com.emranhss.CourierManagement.dto.response.AgentResponseDTO;
import com.emranhss.CourierManagement.dto.response.CustomerResponseDTO;
import com.emranhss.CourierManagement.dto.response.ParcelResponseDTO;
import com.emranhss.CourierManagement.dto.request.AgentParcelRequestDTO;
import com.emranhss.CourierManagement.dto.request.AgentRequestDTO;
import com.emranhss.CourierManagement.dto.request.StatusUpdateRequestDTO;
import com.emranhss.CourierManagement.enums.ParcelStatus;
import com.emranhss.CourierManagement.service.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;


    // ── Agent management (Admin) ──────────────────────────────────

    // POST /api/agents  — multipart: "agent" (JSON) + "image" (file, optional)
    @PostMapping
    public ResponseEntity<AgentResponseDTO> create(
            @RequestPart("agent") AgentRequestDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return new ResponseEntity<>(agentService.create(dto, image), HttpStatus.CREATED);
    }


    // GET /api/agents
    @GetMapping
    public ResponseEntity<List<AgentResponseDTO>> getAll() {
        List<AgentResponseDTO> list = agentService.getAll();
        return list.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(list);
    }

    // GET /api/agents/1
    @GetMapping("/{id}")
    public AgentResponseDTO getById(@PathVariable Long id) {
        return agentService.getById(id);
    }

    // GET /api/agents/hub/3  — all agents at a specific hub
    @GetMapping("/hub/{hubId}")
    public ResponseEntity<List<AgentResponseDTO>> getByHub(@PathVariable Long hubId) {
        List<AgentResponseDTO> list = agentService.getByHub(hubId);
        return list.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(list);
    }

    // PUT /api/agents/1
    @PutMapping("/{id}")
    public AgentResponseDTO update(
            @PathVariable Long id,
            @RequestPart("agent") AgentRequestDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return agentService.update(id, dto, image);
    }

    // DELETE /api/agents/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        agentService.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // ── Hub parcel operations (Agent) ─────────────────────────────

    // Agent books a walk-in parcel at hub counter
    // POST /api/agents/parcels/book
    // Body: AgentParcelRequestDTO (JSON)
    @PostMapping("/parcels/book")
    public ResponseEntity<ParcelResponseDTO> bookParcel(
            @RequestBody AgentParcelRequestDTO dto) {
        return new ResponseEntity<>(agentService.bookParcel(dto), HttpStatus.CREATED);
    }

    // Agent sees all parcels at their hub (origin OR destination)
    // GET /api/agents/1/parcels
    @GetMapping("/{agentId}/parcels")
    public ResponseEntity<List<ParcelResponseDTO>> getHubParcels(
            @PathVariable Long agentId) {
        List<ParcelResponseDTO> list = agentService.getHubParcels(agentId);
        return list.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(list);
    }

    // Agent sees hub parcels filtered by status
    // GET /api/agents/1/parcels?status=IN_TRANSIT
    @GetMapping("/{agentId}/parcels/status/{status}")
    public ResponseEntity<List<ParcelResponseDTO>> getHubParcelsByStatus(
            @PathVariable Long agentId,
            @PathVariable String status) {
        ParcelStatus parcelStatus;
        try {
            parcelStatus = ParcelStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(agentService.getHubParcelsByStatus(agentId, parcelStatus));
    }
//    public ResponseEntity<List<ParcelResponseDTO>> getHubParcelsByStatus(
//            @PathVariable Long agentId,
//            @PathVariable String status) {
//        ParcelStatus parcelStatus;
//        try {
//            parcelStatus = ParcelStatus.valueOf(status.toUpperCase());
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().build();
//        }
//        List<ParcelResponseDTO> list = agentService.getHubParcelsByStatus(agentId, parcelStatus);
//        return list.isEmpty()
//                ? ResponseEntity.noContent().build()
//                : ResponseEntity.ok(list);
//    }

    // Agent updates status of a parcel at their hub
    // PATCH /api/agents/1/parcels/5/status
    // Body: { "status": "IN_TRANSIT", "note": "...", "location": "Mirpur Hub" }
    @PatchMapping("/{agentId}/parcels/{parcelId}/status")
    public ParcelResponseDTO updateParcelStatus(
            @PathVariable Long agentId,
            @PathVariable Long parcelId,
            @RequestBody StatusUpdateRequestDTO dto) {
        return agentService.updateParcelStatus(agentId, parcelId, dto);
    }


    @GetMapping("/user/{id}")
    public AgentResponseDTO getByUserId(@PathVariable Long id) {
        return agentService.getByUserId(id);
    }

}
