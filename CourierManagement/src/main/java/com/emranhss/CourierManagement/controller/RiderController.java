package com.emranhss.CourierManagement.controller;

import com.emranhss.CourierManagement.dto.response.CustomerResponseDTO;
import com.emranhss.CourierManagement.dto.response.RiderResponseDTO;
import com.emranhss.CourierManagement.dto.request.RiderRequestDTO;
import com.emranhss.CourierManagement.service.AgentService;
import com.emranhss.CourierManagement.service.RiderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;


@RestController
@RequestMapping("/api/rider/")
public class RiderController {

    @Autowired
    private RiderService riderService;
    @Autowired
    private AgentService agentService;


    @PostMapping
    public ResponseEntity<RiderResponseDTO> create(
            @RequestPart("rider") RiderRequestDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        return new ResponseEntity<>(
                riderService.create(dto, image),
                HttpStatus.CREATED
        );
    }

//    @GetMapping
//    public List<RiderResponseDTO> getAll() {
//        return riderService.getAll();
//    }

    @GetMapping
    public ResponseEntity<List<RiderResponseDTO>> getAll() {

        List<RiderResponseDTO> riders = riderService.getAll();

        if (riders.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204
        }

        return ResponseEntity.ok(riders);
    }


    @GetMapping("/{id}")
    public RiderResponseDTO getById(@PathVariable Long id) {
        return riderService.getById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        riderService.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    @GetMapping("/user/{id}")
    public RiderResponseDTO getByUserId(@PathVariable Long id) {
        return riderService.getByUserId(id);
    }


    // ── Zone / coverage queries ────────────────────────────────────

    // GET /api/riders/police-station/3
    @GetMapping("/police-station/{policeStationId}")
    public List<RiderResponseDTO> getByPoliceStation(@PathVariable Long policeStationId) {
        return riderService.getByPoliceStation(policeStationId);
    }

    // GET /api/riders/police-station/3/active
    @GetMapping("/police-station/{policeStationId}/active")
    public List<RiderResponseDTO> getActiveByPoliceStation(@PathVariable Long policeStationId) {
        return riderService.getActiveByPoliceStation(policeStationId);
    }

    // GET /api/riders/district/2
    @GetMapping("/district/{districtId}")
    public List<RiderResponseDTO> getByDistrict(@PathVariable Long districtId) {
        return riderService.getByDistrict(districtId);
    }

    // GET /api/riders/district/2/active
    @GetMapping("/district/{districtId}/active")
    public List<RiderResponseDTO> getActiveByDistrict(@PathVariable Long districtId) {
        return riderService.getActiveByDistrict(districtId);
    }

    // ── Status toggle ─────────────────────────────────────────────

    // PATCH /api/riders/1/active?value=true
    @PatchMapping("/{id}/active")
    public RiderResponseDTO setActive(
            @PathVariable Long id,
            @RequestParam boolean value) {
        return riderService.setActive(id, value);
    }



}
