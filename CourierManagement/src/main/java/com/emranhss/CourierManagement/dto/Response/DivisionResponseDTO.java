package com.emranhss.CourierManagement.dto.response;

import lombok.Data;

@Data
public class DivisionResponseDTO {
    private Long id;
    private String name;
    private String nameBn;
    private Boolean active;
    private Long countryId;
    private String countryName;
    private int totalDistricts;
}

