package com.emranhss.CourierManagement.dto.mapper;

import com.emranhss.CourierManagement.dto.response.PoliceStationResponseDTO;
import com.emranhss.CourierManagement.dto.request.PoliceStationRequestDTO;
import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.Division;
import com.emranhss.CourierManagement.entity.PoliceStation;

public class PoliceStationMapper {

    // Entity → Response DTO
    public static PoliceStationResponseDTO toDTO(PoliceStation ps) {

        PoliceStationResponseDTO dto = new PoliceStationResponseDTO();

        dto.setId(ps.getId());
        dto.setName(ps.getName());
        dto.setNameBn(ps.getNameBn());
        dto.setPostalCode(ps.getPostalCode());
        dto.setActive(ps.getActive());

        // District fields
        District district = ps.getDistrict();
        if (district != null) {
            dto.setDistrictId(district.getId());
            dto.setDistrictName(district.getName());

            // Division fields (through district)
            Division division = district.getDivision();
            if (division != null) {
                dto.setDivisionId(division.getId());
                dto.setDivisionName(division.getName());

                // Country fields (through division)
                if (division.getCountry() != null) {
                    dto.setCountryId(division.getCountry().getId());
                    dto.setCountryName(division.getCountry().getName());
                }
            }
        }

        return dto;
    }

    // Request DTO → Entity (district must be set separately in service)
    public static PoliceStation toEntity(PoliceStationRequestDTO dto) {

        PoliceStation ps = new PoliceStation();

        ps.setName(dto.getName());
        ps.setNameBn(dto.getNameBn());
        ps.setPostalCode(dto.getPostalCode());
        ps.setActive(dto.getActive() != null ? dto.getActive() : true);
        // district is resolved by id in the service layer

        return ps;
    }

    // Apply request DTO onto existing entity (for update)
    public static void updateEntity(PoliceStation ps, PoliceStationRequestDTO dto) {

        if (dto.getName() != null)       ps.setName(dto.getName());
        if (dto.getNameBn() != null)     ps.setNameBn(dto.getNameBn());
        if (dto.getPostalCode() != null) ps.setPostalCode(dto.getPostalCode());
        if (dto.getActive() != null)     ps.setActive(dto.getActive());
        // districtId change is handled in the service layer
    }
}

