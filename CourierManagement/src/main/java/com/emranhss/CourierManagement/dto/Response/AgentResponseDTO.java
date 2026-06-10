package com.emranhss.CourierManagement.dto.Response;

import lombok.Data;

@Data
public class AgentResponseDTO {

    private Long    id;

    // From User
    private Long    userId;
    private String  name;
    private String  email;
    private String  phone;
    private String  role;

    // Agent profile
    private String  designation;
    private String  image;
    private Boolean active;

    // Hub details (full location chain)
    private Long    hubId;
    private String  hubName;
    private String  postalCode;
    private Long    districtId;
    private String  districtName;
    private Long    divisionId;
    private String  divisionName;
    private String  countryName;


}
