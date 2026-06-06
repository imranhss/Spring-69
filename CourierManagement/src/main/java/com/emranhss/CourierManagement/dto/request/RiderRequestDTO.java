package com.emranhss.CourierManagement.dto.request;

import lombok.Data;

@Data
public class RiderRequestDTO {

    private String name;

    private String email;

    private String phone;

    private String password;

    

    private String vehicleType;

    private String vehicleNumber;

    private String nidNumber;

    private String zone;

}
