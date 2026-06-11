package com.emranhss.CourierManagement.dto.request;

import lombok.Data;

@Data
public class PoliceStationRequestDTO {
    private String name;
    private String nameBn;
    private String postalCode;
    private Boolean active;
    private Long districtId;
}
