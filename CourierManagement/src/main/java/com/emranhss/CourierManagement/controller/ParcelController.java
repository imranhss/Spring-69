package com.emranhss.CourierManagement.controller;

import com.emranhss.CourierManagement.dto.response.ParcelResponseDTO;
import com.emranhss.CourierManagement.dto.request.ParcelRequestDTO;
import com.emranhss.CourierManagement.dto.request.StatusUpdateRequestDTO;
import com.emranhss.CourierManagement.service.ParcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parcels")
@RequiredArgsConstructor
public class ParcelController {

    private final ParcelService parcelService;

    // Customer books a parcel
    @PostMapping("/book")
    public ResponseEntity<ParcelResponseDTO> book(@RequestBody ParcelRequestDTO dto) {
        return new ResponseEntity<>(parcelService.book(dto), HttpStatus.CREATED);
    }

    // Customer views own parcels
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ParcelResponseDTO>> getByCustomer(@PathVariable Long customerId) {
        List<ParcelResponseDTO> list = parcelService.getByCustomer(customerId);
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    // Public tracking — no auth needed
    @GetMapping("/track/{trackingCode}")
    public ParcelResponseDTO track(@PathVariable String trackingCode) {
        return parcelService.track(trackingCode);
    }

    // Customer cancels (only PENDING allowed)
    @PatchMapping("/{id}/cancel")
    public ParcelResponseDTO cancel(@PathVariable Long id, @RequestParam Long customerId) {
        return parcelService.cancel(id, customerId);
    }

    // Admin: all parcels
    @GetMapping
    public ResponseEntity<List<ParcelResponseDTO>> getAll() {
        List<ParcelResponseDTO> list = parcelService.getAll();
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ParcelResponseDTO getById(@PathVariable Long id) {
        return parcelService.getById(id);
    }

    // Rider: unassigned pending parcels
    @GetMapping("/pending/unassigned")
    public List<ParcelResponseDTO> getPendingUnassigned() {
        return parcelService.getPendingUnassigned();
    }

    // Admin: assign a rider
    @PatchMapping("/{id}/assign-rider/{riderId}")
    public ParcelResponseDTO assignRider(@PathVariable Long id, @PathVariable Long riderId) {
        return parcelService.assignRider(id, riderId);
    }

    // Rider: update delivery status
    // Body: { "status": "IN_TRANSIT", "note": "...", "location": "...", "riderId": 2 }
    @PatchMapping("/{id}/status")
    public ParcelResponseDTO updateStatus(@PathVariable Long id,
                                          @RequestBody StatusUpdateRequestDTO dto) {
        return parcelService.updateStatus(id, dto);
    }

    // Admin: delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        parcelService.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // Price preview — GET /api/parcels/calculate?weight=2.5&serviceType=EXPRESS&codAmount=1500
    @GetMapping("/calculate")
    public ResponseEntity<Double> calculateCharge(
            @RequestParam double weight,
            @RequestParam String serviceType,
            @RequestParam(defaultValue = "0") double codAmount) {
        return ResponseEntity.ok(parcelService.calculateCharge(weight, serviceType, codAmount));
    }

}


//{
//        "customerId": 1,
//
//        "senderName": "Fatema Begum",
//        "senderPhone": "01933333333",
//        "senderAddress": "House 12, Road 5, Mirpur-1, Dhaka",
//        "originPoliceStationId": 1,
//
//        "receiverName": "Nadia Islam",
//        "receiverPhone": "01755555555",
//        "receiverAddress": "Flat 3B, Bashundhara R/A, Dhaka",
//        "destinationPoliceStationId": 2,
//
//        "parcelType": "PRODUCT",
//        "weight": 2.5,
//        "description": "Electronics item",
//        "specialInstructions": "Handle with care",
//        "serviceType": "EXPRESS",
//        "priority": "NORMAL",
//        "paymentMethod": "COD",
//        "codAmount": 2500
//
//        }