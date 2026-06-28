package com.emranhss.CourierManagement.dto.request;

import lombok.Data;

@Data
public class StatusUpdateRequestDTO {

    private String status;
    private String note;
    private String location;
    private Long   riderId;
    private Long nextHubPoliceStationId; // which hub to route to next

}
