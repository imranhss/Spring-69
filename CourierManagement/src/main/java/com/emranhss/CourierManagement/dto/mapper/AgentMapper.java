package com.emranhss.CourierManagement.dto.mapper;

import com.emranhss.CourierManagement.dto.Response.AgentResponseDTO;
import com.emranhss.CourierManagement.entity.Agent;
import com.emranhss.CourierManagement.entity.District;
import com.emranhss.CourierManagement.entity.Division;
import com.emranhss.CourierManagement.entity.PoliceStation;

public class AgentMapper {

    public static AgentResponseDTO toDTO(Agent agent) {

        AgentResponseDTO dto = new AgentResponseDTO();

        dto.setId(agent.getId());
        dto.setDesignation(agent.getDesignation());
        dto.setImage(agent.getImage());
        dto.setActive(agent.getActive());

        // Flatten User fields
        if (agent.getUser() != null) {
            dto.setUserId(agent.getUser().getId());
            dto.setName(agent.getUser().getName());
            dto.setEmail(agent.getUser().getEmail());
            dto.setPhone(agent.getUser().getPhone());
            dto.setRole(agent.getUser().getRole() != null
                    ? agent.getUser().getRole().name() : null);
        }

        // Hub (PoliceStation) → District → Division → Country
        PoliceStation hub = agent.getHub();
        if (hub != null) {
            dto.setHubId(hub.getId());
            dto.setHubName(hub.getName());
            dto.setPostalCode(hub.getPostalCode());

            District district = hub.getDistrict();
            if (district != null) {
                dto.setDistrictId(district.getId());
                dto.setDistrictName(district.getName());

                Division division = district.getDivision();
                if (division != null) {
                    dto.setDivisionId(division.getId());
                    dto.setDivisionName(division.getName());

                    if (division.getCountry() != null) {
                        dto.setCountryName(division.getCountry().getName());
                    }
                }
            }
        }

        return dto;
    }
}
