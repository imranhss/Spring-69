package com.emranhss.CourierManagement.dto.request;

import lombok.Data;

@Data
public class DivisionRequestDTO {
    private String name;
    private String nameBn;
    private Boolean active;
    private Long countryId;
}
