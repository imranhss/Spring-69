package com.emranhss.CourierManagement.dto.request;


import lombok.Data;

@Data
public class DistrictRequestDTO {
    private String name;
    private String nameBn;
    private String districtCode;
    private Boolean active;
    private Long divisionId;
}
