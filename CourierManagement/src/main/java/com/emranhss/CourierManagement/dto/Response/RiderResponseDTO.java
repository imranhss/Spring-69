package com.emranhss.CourierManagement.dto.Response;

import lombok.Data;

@Data
public class RiderResponseDTO {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private String vehicleType;

    private String vehicleNumber;

    private String nidNumber;

    private String zone;

    private Double rating;

    private Integer totalDeliveries;

    private Double totalEarnings;

    private Boolean active;

    private String image;

    private Long userId;

}
