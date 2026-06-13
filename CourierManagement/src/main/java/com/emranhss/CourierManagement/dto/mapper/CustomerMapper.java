package com.emranhss.CourierManagement.dto.mapper;

import com.emranhss.CourierManagement.dto.response.CustomerResponseDTO;
import com.emranhss.CourierManagement.entity.Customer;
import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.Division;
import com.emranhss.CourierManagement.entity.PoliceStation;

public class CustomerMapper {

    public static CustomerResponseDTO toDTO(Customer customer) {

        CustomerResponseDTO dto = new CustomerResponseDTO();

        dto.setId(customer.getId());

        // Flatten User fields
        if (customer.getUser() != null) {
            dto.setUserId(customer.getUser().getId());
            dto.setName(customer.getUser().getName());
            dto.setEmail(customer.getUser().getEmail());
            dto.setPhone(customer.getUser().getPhone());
            dto.setRole(customer.getUser().getRole() != null
                    ? customer.getUser().getRole().name() : null);
        }

        // Profile fields
        dto.setAddress(customer.getAddress());
        dto.setGender(customer.getGender());
        dto.setDob(customer.getDob() != null
                ? customer.getDob().toString() : null);
        dto.setImage(customer.getImage());

        // Location hierarchy
        PoliceStation ps = customer.getPoliceStation();
        if (ps != null) {
            dto.setPoliceStationId(ps.getId());
            dto.setPoliceStationName(ps.getName());

            District district = ps.getDistrict();
            if (district != null) {
                dto.setDistrictName(district.getName());

                Division division = district.getDivision();
                if (division != null) {
                    dto.setDivisionName(division.getName());
                }
            }
        }

        return dto;
    }
}
