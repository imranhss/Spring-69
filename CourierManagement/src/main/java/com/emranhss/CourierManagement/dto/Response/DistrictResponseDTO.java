package com.emranhss.CourierManagement.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistrictResponseDTO {

    private Long districtId;
    private String districtName;
    private Long divisionId;
    private  String divisionName;
    private  String countryName;
    private  String countryCode;
    private Long countryId;



}
