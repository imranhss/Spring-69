package com.emranhss.CourierManagement.enums;

public enum Role {

    RIDER,
    CUSTOMER,
    AGENT,
    ADMIN;

    // Returns Spring Security compatible authority string
    public String getAuthority() {
        return "ROLE_" + this.name();
    }

}
