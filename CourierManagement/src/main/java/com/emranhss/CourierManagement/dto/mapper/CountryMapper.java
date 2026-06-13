package com.emranhss.CourierManagement.dto.mapper;

import com.emranhss.CourierManagement.dto.response.CountryResponseDTO;
import com.emranhss.CourierManagement.dto.request.CountryRequestDTO;
import com.emranhss.CourierManagement.entity.Country;

public class CountryMapper {

    // Entity → Response DTO
    public static CountryResponseDTO toDTO(Country country) {

        CountryResponseDTO dto = new CountryResponseDTO();

        dto.setId(country.getId());
        dto.setName(country.getName());
        dto.setCode(country.getCode());
        dto.setPhoneCode(country.getPhoneCode());
        dto.setActive(country.getActive());
        dto.setTotalDivisions(
                country.getDivisions() != null ? country.getDivisions().size() : 0
        );

        return dto;
    }

    // Request DTO → Entity
    public static Country toEntity(CountryRequestDTO dto) {

        Country country = new Country();

        country.setName(dto.getName());
        country.setCode(dto.getCode() != null ? dto.getCode().toUpperCase() : null);
        country.setPhoneCode(dto.getPhoneCode());
        country.setActive(dto.getActive() != null ? dto.getActive() : true);

        return country;
    }

    // Apply request DTO onto existing entity (for update)
    public static void updateEntity(Country country, CountryRequestDTO dto) {

        if (dto.getName() != null)      country.setName(dto.getName());
        if (dto.getCode() != null)      country.setCode(dto.getCode().toUpperCase());
        if (dto.getPhoneCode() != null) country.setPhoneCode(dto.getPhoneCode());
        if (dto.getActive() != null)    country.setActive(dto.getActive());
    }
}
