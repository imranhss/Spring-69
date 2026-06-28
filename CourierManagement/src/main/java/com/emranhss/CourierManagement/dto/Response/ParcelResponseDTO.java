package com.emranhss.CourierManagement.dto.response;


import com.emranhss.CourierManagement.enums.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ParcelResponseDTO {

    private Long   id;
    private String trackingCode;

    // ── Sender ────────────────────────────────────────────────────
    private String senderName;
    private String senderPhone;
    private String senderAddress;
    private String originPoliceStation;
    private String originDistrict;
    private String originDivision;

    // ── Receiver ──────────────────────────────────────────────────
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String destinationPoliceStation;
    private String destinationDistrict;
    private String destinationDivision;

    // ── Parcel details ────────────────────────────────────────────
    private ParcelType parcelType;
    private Double      weight;
    private String      description;
    private String      specialInstructions;

    // ── Service & pricing ─────────────────────────────────────────
    private ServiceType serviceType;
    private Priority priority;
    private Double      deliveryCharge;
    private Double      codAmount;

    // ── Payment ───────────────────────────────────────────────────
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;

    // ── Status ────────────────────────────────────────────────────
    private ParcelStatus  status;
    private LocalDate estimatedDelivery;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── Customer ──────────────────────────────────────────────────
    private Long   customerId;
    private String customerName;
    private String customerPhone;

    // ── Rider ─────────────────────────────────────────────────────
    private Long   riderId;
    private String riderName;
    private String riderPhone;


    // Set if bookingSource = AGENT
    private Long   agentId;
    private String agentName;
    private String agentHubName;

    // ── Tracking history ──────────────────────────────────────────
    private List<HistoryEntry> history;

    @Data
    public static class HistoryEntry {
        private Long          id;
        private String        status;
        private String        note;
        private String        location;
        private LocalDateTime timestamp;
        private String        performedBy;
        private Long   riderId;
    }

}
