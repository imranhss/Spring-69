package com.emranhss.CourierManagement.dto.Response;

import lombok.Data;

@Data
public class CustomerResponseDTO {

    private Long id;

    // From User
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String role;

    // Customer profile
    private String address;
    private String gender;
    private String dob;
    private String image;

    // Location
    private Long policeStationId;
    private String policeStationName;
    private String districtName;
    private String divisionName;


}
