package com.emranhss.CourierManagement.entity;


import com.emranhss.CourierManagement.enums.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;



@Entity
@Table(name = "parcels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Parcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackingCode;

    private String senderName;
    private String senderPhone;
    private String senderAddress;

    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;

    private Double weight;
    private String description;
    private String specialInstructions;

    @Enumerated(EnumType.STRING)
    private ParcelType parcelType;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private ParcelStatus status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;


    private LocalDate estimatedDelivery;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Double deliveryCharge;
    private Double codAmount = 0.0;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_ps_id")
    private PoliceStation originPoliceStation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_ps_id")
    private PoliceStation destinationPoliceStation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_hub_ps_id")
    private PoliceStation currentHub; // updates at every hub stop

    @OneToMany(mappedBy = "parcel", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ParcelHistory> history = new ArrayList<>();


    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rider_id")
    private Rider rider;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private Agent bookedByAgent;




    // ── Booking source ────────────────────────────────────────────
    // Exactly one of these will be set:
    //   customer  → booked online by a registered customer
    //   bookedByAgent → booked at a hub counter by an agent (walk-in)
    @Enumerated(EnumType.STRING)
    private BookingSource bookingSource; // ONLINE / AGENT


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


}
