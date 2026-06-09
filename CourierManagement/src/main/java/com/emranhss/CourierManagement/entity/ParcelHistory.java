package com.emranhss.CourierManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "parcel_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParcelHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String        status;
    private String        note;
    private String        location;
    private LocalDateTime createdAt;


    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private Parcel parcel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_rider_id")
    private Rider performedBy;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}
