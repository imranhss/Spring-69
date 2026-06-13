package com.emranhss.CourierManagement.controller;

import com.emranhss.CourierManagement.dto.response.RiderResponseDTO;
import com.emranhss.CourierManagement.dto.request.RiderRequestDTO;
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


}
