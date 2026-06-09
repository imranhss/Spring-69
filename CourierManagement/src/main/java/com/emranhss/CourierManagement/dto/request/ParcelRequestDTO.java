package com.emranhss.CourierManagement.dto.request;


import com.emranhss.CourierManagement.enums.ParcelType;
import com.emranhss.CourierManagement.enums.PaymentMethod;
import com.emranhss.CourierManagement.enums.Priority;
import com.emranhss.CourierManagement.enums.ServiceType;
import lombok.Data;

@Data
public class ParcelRequestDTO {

    // Who is booking (logged-in customer's id)
    private Long customerId;

    // ── Sender info ───────────────────────────────────────────────
    private String senderName;
    private String senderPhone;
    private String senderAddress;
    private Long   originPoliceStationId;      // pickup thana

    // ── Receiver info ─────────────────────────────────────────────
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private Long   destinationPoliceStationId; // delivery thana

    // ── Parcel details ────────────────────────────────────────────
    private ParcelType parcelType;
    private Double       weight;
    private String       description;
    private String       specialInstructions;

    // ── Service ───────────────────────────────────────────────────
    private ServiceType serviceType;
    private Priority priority;

    // ── Payment ───────────────────────────────────────────────────
    private PaymentMethod paymentMethod;
    private Double        codAmount;

}
