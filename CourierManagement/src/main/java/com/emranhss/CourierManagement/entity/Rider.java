package com.emranhss.CourierManagement.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "riders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private  String name;
    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    @Size(max = 20, min = 4)
    private String password;

    private String vehicleType;

    private String vehicleNumber;

    private String nidNumber;

    private String zone;

    private Double rating = 0.0;

    private Integer totalDeliveries = 0;

    private Double totalEarnings = 0.0;

    private Boolean active = true;

    private String image;


    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


}
