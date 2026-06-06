package com.emranhss.CourierManagement.dto.mapper;

import com.emranhss.CourierManagement.dto.Response.RiderResponseDTO;
import com.emranhss.CourierManagement.dto.request.RiderRequestDTO;
import com.emranhss.CourierManagement.entity.Rider;
import com.emranhss.CourierManagement.entity.User;

public class RiderMapper {

    // DTO → Entity
    public static Rider toEntity(RiderRequestDTO dto) {

        Rider rider = new Rider();

        rider.setVehicleType(dto.getVehicleType());
        rider.setVehicleNumber(dto.getVehicleNumber());
        rider.setNidNumber(dto.getNidNumber());
        rider.setZone(dto.getZone());

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());
        user.setRole("RIDER");


        rider.setUser(user);

        return rider;
    }

    // Entity → DTO
    public static RiderResponseDTO toDTO(Rider rider) {

        RiderResponseDTO dto = new RiderResponseDTO();

        dto.setId(rider.getId());

        dto.setName(rider.getUser().getName());
        dto.setEmail(rider.getUser().getEmail());
        dto.setPhone(rider.getUser().getPhone());
        dto.setRole(rider.getUser().getRole());

        dto.setVehicleType(rider.getVehicleType());
        dto.setVehicleNumber(rider.getVehicleNumber());
        dto.setNidNumber(rider.getNidNumber());
        dto.setZone(rider.getZone());

        dto.setRating(rider.getRating());
        dto.setTotalDeliveries(rider.getTotalDeliveries());
        dto.setTotalEarnings(rider.getTotalEarnings());
        dto.setActive(rider.getActive());

        dto.setImage(rider.getImage());

        dto.setUserId(rider.getUser().getId());

        return dto;
    }
}
