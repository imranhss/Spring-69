package com.emranhss.CourierManagement.dto.mapper;

import com.emranhss.CourierManagement.dto.response.DistrictResponseDTO;
import com.emranhss.CourierManagement.dto.request.DistrictRequestDTO;
import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.Division;

public class DistrictMapper {

    // Entity → Response DTO
    public static DistrictResponseDTO toDTO(District district) {

        DistrictResponseDTO dto = new DistrictResponseDTO();

        dto.setId(district.getId());
        dto.setName(district.getName());
        dto.setNameBn(district.getNameBn());
        dto.setDistrictCode(district.getDistrictCode());
        dto.setActive(district.getActive());
        dto.setTotalPoliceStations(
                district.getPoliceStations() != null
                        ? district.getPoliceStations().size() : 0
        );

        // Division fields
        Division division = district.getDivision();
        if (division != null) {
            dto.setDivisionId(division.getId());
            dto.setDivisionName(division.getName());

            // Country fields (through division)
            if (division.getCountry() != null) {
                dto.setCountryId(division.getCountry().getId());
                dto.setCountryName(division.getCountry().getName());
                dto.setCountryCode(division.getCountry().getCode());
            }
        }

        return dto;
    }

    // Request DTO → Entity (division must be set separately in service)
    public static District toEntity(DistrictRequestDTO dto) {

        District district = new District();

        district.setName(dto.getName());
        district.setNameBn(dto.getNameBn());
        district.setDistrictCode(dto.getDistrictCode());
        district.setActive(dto.getActive() != null ? dto.getActive() : true);
        // division is resolved by id in the service layer

        return district;
    }

    // Apply request DTO onto existing entity (for update)
    public static void updateEntity(District district, DistrictRequestDTO dto) {

        if (dto.getName() != null)         district.setName(dto.getName());
        if (dto.getNameBn() != null)       district.setNameBn(dto.getNameBn());
        if (dto.getDistrictCode() != null) district.setDistrictCode(dto.getDistrictCode());
        if (dto.getActive() != null)       district.setActive(dto.getActive());
        // divisionId change is handled in the service layer
    }
}
