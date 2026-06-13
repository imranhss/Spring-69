package com.emranhss.CourierManagement.dto.mapper;

import com.emranhss.CourierManagement.dto.response.CountryResponseDTO;
import com.emranhss.CourierManagement.dto.response.DistrictResponseDTO;
import com.emranhss.CourierManagement.dto.response.DivisionResponseDTO;
import com.emranhss.CourierManagement.dto.response.PoliceStationResponseDTO;
import com.emranhss.CourierManagement.dto.request.CountryRequestDTO;
import com.emranhss.CourierManagement.entity.Country;
import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.Division;
import com.emranhss.CourierManagement.entity.PoliceStation;

public class GeoMapper {

    // ── Country ───────────────────────────────────────────────────
    public static CountryResponseDTO toDTO(Country country) {

        CountryResponseDTO dto = new CountryResponseDTO();
        dto.setId(country.getId());
        dto.setName(country.getName());
        dto.setCode(country.getCode());
        dto.setPhoneCode(country.getPhoneCode());

        dto.setTotalDivisions(
                country.getDivisions() != null ? country.getDivisions().size() : 0
        );
        return dto;
    }

    public static Country toEntity(CountryRequestDTO dto) {
        Country country = new Country();
        country.setName(dto.getName());
        country.setCode(dto.getCode() != null ? dto.getCode().toUpperCase() : null);
        country.setPhoneCode(dto.getPhoneCode());
        country.setActive(dto.getActive() != null ? dto.getActive() : true);
        return country;
    }

    // ── Division ──────────────────────────────────────────────────
    public static DivisionResponseDTO toDTO(Division division) {
        DivisionResponseDTO dto = new DivisionResponseDTO();
        dto.setId(division.getId());
        dto.setName(division.getName());
        dto.setNameBn(division.getNameBn());
        dto.setActive(division.getActive());
        dto.setTotalDistricts(
                division.getDistricts() != null ? division.getDistricts().size() : 0
        );
        if (division.getCountry() != null) {
            dto.setCountryId(division.getCountry().getId());
            dto.setCountryName(division.getCountry().getName());
        }
        return dto;
    }

    // ── District ──────────────────────────────────────────────────
    public static DistrictResponseDTO toDTO(District district) {
        DistrictResponseDTO dto = new DistrictResponseDTO();
        dto.setId(district.getId());
        dto.setName(district.getName());
        dto.setNameBn(district.getNameBn());
        dto.setDistrictCode(district.getDistrictCode());
        dto.setActive(district.getActive());
        dto.setTotalPoliceStations(
                district.getPoliceStations() != null ? district.getPoliceStations().size() : 0
        );
        if (district.getDivision() != null) {
            dto.setDivisionId(district.getDivision().getId());
            dto.setDivisionName(district.getDivision().getName());
            if (district.getDivision().getCountry() != null) {
                dto.setCountryId(district.getDivision().getCountry().getId());
                dto.setCountryName(district.getDivision().getCountry().getName());
            }
        }
        return dto;
    }

    // ── PoliceStation ─────────────────────────────────────────────
    public static PoliceStationResponseDTO toDTO(PoliceStation ps) {
        PoliceStationResponseDTO dto = new PoliceStationResponseDTO();
        dto.setId(ps.getId());
        dto.setName(ps.getName());
        dto.setNameBn(ps.getNameBn());
        dto.setPostalCode(ps.getPostalCode());
        dto.setActive(ps.getActive());
        if (ps.getDistrict() != null) {
            dto.setDistrictId(ps.getDistrict().getId());
            dto.setDistrictName(ps.getDistrict().getName());
            if (ps.getDistrict().getDivision() != null) {
                dto.setDivisionId(ps.getDistrict().getDivision().getId());
                dto.setDivisionName(ps.getDistrict().getDivision().getName());
                if (ps.getDistrict().getDivision().getCountry() != null) {
                    dto.setCountryId(ps.getDistrict().getDivision().getCountry().getId());
                    dto.setCountryName(ps.getDistrict().getDivision().getCountry().getName());
                }
            }
        }
        return dto;
    }

}
