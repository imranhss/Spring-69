package com.emranhss.CourierManagement.dto.mapper;

import com.emranhss.CourierManagement.dto.Response.RiderResponseDTO;
import com.emranhss.CourierManagement.dto.request.RiderRequestDTO;
import com.emranhss.CourierManagement.entity.*;
import com.emranhss.CourierManagement.enums.Role;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * RiderMapper
 *
 * Responsible for converting:
 * 1. RiderRequestDTO -> Rider Entity
 * 2. Rider Entity -> RiderResponseDTO
 *
 * This class helps separate API models (DTOs)
 * from database entities.
 */
public class RiderMapper {

    /**
     * Convert RiderRequestDTO to Rider Entity.
     *
     * Used during rider creation.
     *
     * @param dto Incoming request data from client
     * @return Rider entity ready for persistence
     */
    public static Rider toEntity(RiderRequestDTO dto) {

        // Create Rider entity
        Rider rider = new Rider();

        // Set rider-specific information
        rider.setVehicleType(dto.getVehicleType());
        rider.setVehicleNumber(dto.getVehicleNumber());
        rider.setNidNumber(dto.getNidNumber());

        /*
         * Create associated User entity.
         *
         * Every rider is linked with a User account.
         */
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        // Password should be encrypted before saving
        user.setPassword(dto.getPassword());

        // Automatically assign RIDER role
        user.setRole(Role.RIDER);

        // Associate user with rider
        rider.setUser(user);

        return rider;
    }

    /**
     * Convert Rider Entity to RiderResponseDTO.
     *
     * Used when sending rider information
     * back to the client.
     *
     * @param rider Rider entity from database
     * @return RiderResponseDTO
     */
    public static RiderResponseDTO toDTO(Rider rider) {

        RiderResponseDTO dto = new RiderResponseDTO();

        // Basic Rider Information
        dto.setId(rider.getId());
        dto.setVehicleType(rider.getVehicleType());
        dto.setVehicleNumber(rider.getVehicleNumber());
        dto.setNidNumber(rider.getNidNumber());

        // Performance Information
        dto.setRating(rider.getRating());
        dto.setTotalDeliveries(rider.getTotalDeliveries());
        dto.setTotalEarnings(rider.getTotalEarnings());

        // Rider Status
        dto.setActive(rider.getActive());

        // Rider Image Path / URL
        dto.setImage(rider.getImage());

        /*
         * Map User information
         * if User relationship exists.
         */
        if (rider.getUser() != null) {

            dto.setUserId(rider.getUser().getId());
            dto.setName(rider.getUser().getName());
            dto.setEmail(rider.getUser().getEmail());
            dto.setPhone(rider.getUser().getPhone());

            // Convert Enum Role to String
            dto.setRole(
                    rider.getUser().getRole() != null
                            ? rider.getUser().getRole().name()
                            : null
            );
        }

        /*
         * Map assigned delivery zones.
         *
         * If no zones assigned,
         * return empty list instead of null.
         */
        if (rider.getZones() == null || rider.getZones().isEmpty()) {

            dto.setZones(Collections.emptyList());

        } else {

            dto.setZones(
                    rider.getZones()
                            .stream()
                            .map(RiderMapper::toZoneSummary)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    /**
     * Convert PoliceStation entity
     * into ZoneSummary DTO.
     *
     * Creates hierarchical location information:
     *
     * Country
     *   -> Division
     *      -> District
     *          -> Police Station
     *
     * @param ps Police Station entity
     * @return ZoneSummary DTO
     */
    private static RiderResponseDTO.ZoneSummary toZoneSummary(PoliceStation ps) {

        RiderResponseDTO.ZoneSummary z =
                new RiderResponseDTO.ZoneSummary();

        // Police Station Information
        z.setPoliceStationId(ps.getId());
        z.setName(ps.getName());
        z.setPostalCode(ps.getPostalCode());

        /*
         * Load District information
         */
        District district = ps.getDistrict();

        if (district != null) {

            z.setDistrictId(district.getId());
            z.setDistrictName(district.getName());

            /*
             * Load Division information
             */
            Division division = district.getDivision();

            if (division != null) {

                z.setDivisionId(division.getId());
                z.setDivisionName(division.getName());

                // Optional Bangla Name
                // z.setDivisionNameBn(division.getNameBn());

                /*
                 * Load Country information
                 */
                Country country = division.getCountry();

                if (country != null) {

                    z.setCountryId(country.getId());
                    z.setCountryName(country.getName());
                }
            }
        }

        return z;
    }

    /**
     * Convert list of Rider entities
     * into list of RiderResponseDTOs.
     *
     * Used in:
     * - Get All Riders API
     * - Search Rider API
     * - Paginated Rider API
     *
     * @param riders List of Rider entities
     * @return List<RiderResponseDTO>
     */
    public static List<RiderResponseDTO> toDTOList(List<Rider> riders) {

        return riders.stream()
                .map(RiderMapper::toDTO)
                .collect(Collectors.toList());
    }
}