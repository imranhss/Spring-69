package com.emranhss.CourierManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DivisionDTO {

    private Integer divisionId;
    private  String divisionName;
    private  String countryName;
    private Integer countryId;

}
