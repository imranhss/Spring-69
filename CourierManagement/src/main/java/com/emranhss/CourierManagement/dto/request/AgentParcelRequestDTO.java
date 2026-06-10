package com.emranhss.CourierManagement.dto.request;

import com.emranhss.CourierManagement.enums.ParcelType;
import com.emranhss.CourierManagement.enums.PaymentMethod;
import com.emranhss.CourierManagement.enums.Priority;
import com.emranhss.CourierManagement.enums.ServiceType;

public class AgentParcelRequestDTO {

    // Agent booking this parcel (required)
    private Long agentId;

    // ── Walk-in sender info (no account needed) ───────────────────
    private String senderName;
    private String senderPhone;
    private String senderAddress;

    // Origin hub is automatically set to agent's hub.
    // Only override if agent is booking for a different origin.
    private Long originPoliceStationId;

    // ── Receiver info ─────────────────────────────────────────────
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private Long   destinationPoliceStationId;

    // ── Parcel details ────────────────────────────────────────────
    private ParcelType parcelType;
    private Double      weight;
    private String      description;
    private String      specialInstructions;

    // ── Service ───────────────────────────────────────────────────
    private ServiceType serviceType;
    private Priority priority;

    // ── Payment ───────────────────────────────────────────────────
    private PaymentMethod paymentMethod;
    private Double        codAmount;


}
