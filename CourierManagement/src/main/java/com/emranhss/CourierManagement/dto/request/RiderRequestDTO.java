package com.emranhss.CourierManagement.dto.request;

import com.emranhss.CourierManagement.dto.Response.RiderResponseDTO;
import lombok.Data;

import java.util.List;

/**
 * RiderRequestDTO
 *
 * Request Data Transfer Object used for creating
 * or updating a Rider in the Courier Management System.
 *
 * This DTO contains:
 * - Rider personal information
 * - Login account information
 * - Vehicle information
 * - National ID information
 * - Assigned delivery zones
 *
 * Received from frontend applications and
 * converted into Rider and User entities.
 */
@Data
public class RiderRequestDTO {

    /**
     * Full name of the rider.
     *
     * Example:
     * Emran Hossain
     */
    private String name;

    /**
     * Rider email address.
     *
     * Used for:
     * - Login
     * - Notifications
     * - Account identification
     *
     * Example:
     * emran@gmail.com
     */
    private String email;

    /**
     * Rider mobile phone number.
     *
     * Used for:
     * - Communication
     * - Login (optional)
     * - Customer contact
     *
     * Example:
     * 01712345678
     */
    private String phone;

    /**
     * Rider account password.
     *
     * This password should never be stored
     * directly in plain text.
     *
     * Must be encrypted using PasswordEncoder
     * before saving to database.
     */
    private String password;

    /**
     * Type of vehicle used by rider.
     *
     * Examples:
     * Bike
     * Bicycle
     * Car
     * Van
     */
    private String vehicleType;

    /**
     * Vehicle registration number.
     *
     * Example:
     * Dhaka Metro-LA-123456
     */
    private String vehicleNumber;

    /**
     * National Identity Card (NID) number.
     *
     * Used for rider verification
     * and legal identification.
     */
    private String nidNumber;

    /**
     * List of delivery zones assigned to rider.
     *
     * A rider can serve multiple
     * police station areas.
     *
     * Example:
     * Mirpur
     * Dhanmondi
     * Uttara
     */
    private List<RiderResponseDTO.ZoneSummary> zones;

    /**
     * ZoneSummary
     *
     * Represents a delivery zone
     * assigned to a rider.
     *
     * Location hierarchy:
     *
     * Division
     *   -> District
     *      -> Police Station
     */
//    @Data
//    public static class ZoneSummary {
//
//        /**
//         * Unique Police Station ID.
//         *
//         * Used to identify the zone
//         * in the database.
//         */
//        private Long id;
//
//        /**
//         * Police Station / Thana Name.
//         *
//         * Examples:
//         * Mirpur
//         * Dhanmondi
//         * Uttara West
//         */
//        private String name;
//
//        /**
//         * Postal or ZIP code
//         * of the police station area.
//         *
//         * Example:
//         * 1216
//         */
//        private String postalCode;
//
//        /**
//         * District name where
//         * the police station belongs.
//         *
//         * Example:
//         * Dhaka
//         * Gazipur
//         */
//        private String districtName;
//
//        /**
//         * Division name where
//         * the district belongs.
//         *
//         * Example:
//         * Dhaka
//         * Chattogram
//         * Khulna
//         */
//        private String divisionName;
//    }
}
