package com.emranhss.CourierManagement.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "policestations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PoliceStation {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // e.g. Mirpur
    private String nameBn;      // e.g. মিরপুর
    private String postalCode;  // e.g. 1216
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;

    // @JsonIgnore prevents circular reference: PoliceStation → Rider → PoliceStation → ...
    @JsonIgnore
    @ManyToMany(mappedBy = "zones")
    private List<Rider> riders = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "policeStation")
    private List<User> users = new ArrayList<>();


}
