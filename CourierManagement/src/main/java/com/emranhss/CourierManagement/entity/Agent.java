package com.emranhss.CourierManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "agents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Agent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Job title at the hub e.g. "Hub Manager", "Booking Clerk"
    private String designation;

    private String image;

    private Boolean active = true;

    // Auth account — name, phone, email, password, role=AGENT lives here
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The Hub (PoliceStation) this agent works at
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "police_station_id", nullable = false)
    private PoliceStation hub;

    // All parcels this agent has booked
    @JsonIgnore
    @OneToMany(mappedBy = "bookedByAgent", fetch = FetchType.LAZY)
    private List<Parcel> bookedParcels = new ArrayList<>();


}
