package com.emranhss.CourierManagement.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "riders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleType;

    private String vehicleNumber;

    private String nidNumber;

    // ── Zone management ──────────────────────────────────────────
    // Rider covers multiple thanas; one thana can have multiple riders.
    // Creates a rider_zones join table automatically.
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "rider_zones",
            joinColumns = @JoinColumn(name = "rider_id"),
            inverseJoinColumns = @JoinColumn(name = "police_station_id")
    )
    private Set<PoliceStation> zones = new HashSet<>();


    private Double rating = 0.0;

    private Integer totalDeliveries = 0;

    private Double totalEarnings = 0.0;

    private Boolean active = true;

    private String image;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


}
