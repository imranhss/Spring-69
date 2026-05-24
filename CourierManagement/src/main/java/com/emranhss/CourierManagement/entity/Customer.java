package com.emranhss.CourierManagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private  String name;

    @Column(unique = true)
    private String phone;

    @Column(unique = true)
    private String email;
    private String address;
    private String gender;
    private Date dob;

    private String image;
    private String password;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;




}
