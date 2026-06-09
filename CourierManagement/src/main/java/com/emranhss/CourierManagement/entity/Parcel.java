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

    @OneToMany(mappedBy = "parcel", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ParcelHistory> history = new ArrayList<>();


    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rider_id")
    private Rider rider;


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
