package com.emranhss.CourierManagement.dto.request;

import lombok.Data;

@Data
public class CustomerRequestDTO {

    // User fields (auth account)
    private String name;
    private String email;
    private String phone;
    private String password;

    // Customer profile fields
    private String address;
    private String gender;    // MALE / FEMALE / OTHER
    private String dob;       // "1995-08-21"

    // policeStation where customer lives (optional)
    private Long policeStationId;
}
