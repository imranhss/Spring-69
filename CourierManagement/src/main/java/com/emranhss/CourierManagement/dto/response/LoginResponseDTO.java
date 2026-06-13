package com.emranhss.CourierManagement.dto.response;

import lombok.Data;

@Data
public class LoginResponseDTO {

    private String  token;
    private String  tokenType = "Bearer";

    private Long    userId;
    private String  name;
    private String  email;
    private String  phone;
    private String  role;

    // Hub info — only set if role = AGENT
    private Long    hubId;
    private String  hubName;
}
