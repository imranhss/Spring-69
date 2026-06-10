package com.emranhss.CourierManagement.dto.request;

import lombok.Data;

@Data
public class AgentRequestDTO {

    // User account fields
    private String name;
    private String email;
    private String phone;
    private String password;

    // Agent profile
    private String  designation;  // e.g. "Hub Manager", "Booking Clerk"

    // Which hub (PoliceStation) this agent works at
    private Long hubId;           // PoliceStation id

}
