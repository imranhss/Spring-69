package com.emranhss.CourierManagement.dto.response;

import lombok.Data;

@Data
public class CountryResponseDTO {
    private Long id;
    private String name;
    private String code;
    private String phoneCode;
    private Boolean active;
    private int totalDivisions;
}

