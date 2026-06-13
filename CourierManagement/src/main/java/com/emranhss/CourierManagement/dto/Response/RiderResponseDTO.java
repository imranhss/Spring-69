package com.emranhss.CourierManagement.dto.response;

import lombok.Data;

import java.util.List;

/**
 * RiderResponseDTO
 *
 * Response Data Transfer Object used to send Rider information
 * from backend to frontend (API response).
 *
 * This DTO is used in:
 * - Get Rider By ID API
 * - Get All Riders API
 * - Rider Profile API
 * - Rider Management Dashboard
 *
 * It combines data from multiple entities:
 * - Rider Entity
 * - User Entity
 * - Location hierarchy (Zone → Police Station → District → Division → Country)
 */
@Data
public class RiderResponseDTO {

    /**
     * Unique Rider ID
     *
     * This is the primary identifier of the Rider entity.
     */
    private Long id;

    /**
     * Rider full name
     *
     * Comes from the associated User entity.
     */
    private String name;

    /**
     * Rider email address
     *
     * Used for communication and account identification.
     */
    private String email;

    /**
     * Rider phone number
     *
     * Used for communication with rider and customers.
     */
    private String phone;

    /**
     * User role
     *
     * Example values:
     * - RIDER
     * - ADMIN
     * - CUSTOMER
     */
    private String role;

    /**
     * Type of vehicle used by rider
     *
     * Example:
     * - Bike
     * - Bicycle
     * - Van
     */
    private String vehicleType;

    /**
     * Vehicle registration number
     *
     * Used for identifying rider's vehicle in the system.
     */
    private String vehicleNumber;

    /**
     * National ID (NID) number of rider
     *
     * Used for verification and identity validation.
     */
    private String nidNumber;

    /**
     * Rider rating score
     *
     * Calculated based on delivery performance and customer feedback.
     * Example: 4.5, 4.8, 5.0
     */
    private Double rating;

    /**
     * Total number of completed deliveries
     *
     * Represents rider's work history.
     */
    private Integer totalDeliveries;

    /**
     * Total earnings of rider
     *
     * Aggregated income from completed deliveries.
     */
    private Double totalEarnings;

    /**
     * Rider active status
     *
     * true  = active rider (can receive deliveries)
     * false = inactive rider
     */
    private Boolean active;

    /**
     * Profile image URL or file path of rider
     *
     * Used for UI profile display.
     */
    private String image;

    /**
     * User ID linked with Rider entity
     *
     * Used for authentication and user management.
     */
    private Long userId;

    /**
     * List of delivery zones assigned to the rider
     *
     * A rider may operate in multiple police station areas.
     */
    private List<ZoneSummary> zones;

    /**
     * ZoneSummary
     *
     * Represents a delivery area assigned to a rider.
     *
     * This is a hierarchical location structure:
     *
     * Country
     *   -> Division
     *      -> District
     *         -> Police Station (Zone)
     */
    @Data
    public static class ZoneSummary {

        /**
         * Unique Police Station ID
         *
         * Acts as the zone identifier.
         */
        private Long policeStationId;

        /**
         * Police Station / Thana name
         *
         * Example:
         * - Mirpur
         * - Dhanmondi
         * - Uttara West
         */
        private String name;

        /**
         * Postal code of the area
         *
         * Example:
         * - 1216
         * - 1207
         */
        private String postalCode;

        /**
         * District ID of the zone
         */
        private Long districtId;

        /**
         * District name
         *
         * Example:
         * - Dhaka
         * - Gazipur
         */
        private String districtName;

        /**
         * Division ID of the zone
         */
        private Long divisionId;

        /**
         * Division name (English)
         *
         * Example:
         * - Dhaka
         * - Chattogram
         */
        private String divisionName;

        /**
         * Division name in Bangla language
         *
         * Example:
         * - ঢাকা
         * - চট্টগ্রাম
         */
        private String divisionNameBn;

        /**
         * Country ID of the zone
         */
        private Long countryId;

        /**
         * Country name
         *
         * Example:
         * - Bangladesh
         */
        private String countryName;
    }
}