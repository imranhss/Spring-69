package com.emranhss.CourierManagement.dto.Response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
public class PoliceStationResponseDTO {
    private Long id;
    private String name;
    private String nameBn;
    private String postalCode;
    private Boolean active;
    private Long districtId;
    private String districtName;
    private Long divisionId;
    private String divisionName;
    private Long countryId;
    private String countryName;
}

