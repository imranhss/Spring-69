package com.emranhss.CourierManagement.dto.request;

import lombok.Data;

@Data
public class CountryRequestDTO {
    private String name;
    private String code;
    private String phoneCode;
    private Boolean active;
}

