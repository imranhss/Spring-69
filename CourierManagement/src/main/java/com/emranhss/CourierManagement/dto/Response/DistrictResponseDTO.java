package com.emranhss.CourierManagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistrictResponseDTO {

    private Long id;
    private String name;
    private String nameBn;
    private String districtCode;
    private Boolean active;
    private Long divisionId;
    private String divisionName;
    private Long countryId;
    private String countryName;
    private String countryCode;
    private int totalPoliceStations;



}
