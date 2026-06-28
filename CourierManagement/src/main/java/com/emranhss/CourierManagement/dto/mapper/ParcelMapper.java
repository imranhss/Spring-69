package com.emranhss.CourierManagement.dto.mapper;

import com.emranhss.CourierManagement.dto.response.ParcelResponseDTO;
import com.emranhss.CourierManagement.entity.*;
import com.emranhss.CourierManagement.enums.ParcelStatus;

import java.util.Collections;
import java.util.stream.Collectors;

public class ParcelMapper {

    public static ParcelResponseDTO toDTO(Parcel parcel) {

        ParcelResponseDTO dto = new ParcelResponseDTO();

        dto.setId(parcel.getId());
        dto.setTrackingCode(parcel.getTrackingCode());


        dto.setSenderName(parcel.getSenderName());
        dto.setSenderPhone(parcel.getSenderPhone());
        dto.setSenderAddress(parcel.getSenderAddress());

        dto.setReceiverName(parcel.getReceiverName());
        dto.setReceiverPhone(parcel.getReceiverPhone());
        dto.setReceiverAddress(parcel.getReceiverAddress());

        dto.setParcelType(parcel.getParcelType());
        dto.setWeight(parcel.getWeight());
        dto.setDescription(parcel.getDescription());
        dto.setSpecialInstructions(parcel.getSpecialInstructions());

        dto.setServiceType(parcel.getServiceType());
        dto.setPriority(parcel.getPriority());
        dto.setDeliveryCharge(parcel.getDeliveryCharge());
        dto.setCodAmount(parcel.getCodAmount());


        dto.setPaymentMethod(parcel.getPaymentMethod());
        dto.setPaymentStatus(parcel.getPaymentStatus());

        dto.setStatus(parcel.getStatus());
        dto.setEstimatedDelivery(parcel.getEstimatedDelivery());
        dto.setCreatedAt(parcel.getCreatedAt());
        dto.setUpdatedAt(parcel.getUpdatedAt());

        // Origin location chain
        if (parcel.getOriginPoliceStation() != null) {
            PoliceStation ops = parcel.getOriginPoliceStation();
            dto.setOriginPoliceStation(ops.getName());
            if (ops.getDistrict() != null) {
                dto.setOriginDistrict(ops.getDistrict().getName());
                if (ops.getDistrict().getDivision() != null)
                    dto.setOriginDivision(ops.getDistrict().getDivision().getName());
            }
        }

        // Destination location chain
        if (parcel.getDestinationPoliceStation() != null) {
            PoliceStation dps = parcel.getDestinationPoliceStation();
            dto.setDestinationPoliceStation(dps.getName());
            if (dps.getDistrict() != null) {
                dto.setDestinationDistrict(dps.getDistrict().getName());
                if (dps.getDistrict().getDivision() != null)
                    dto.setDestinationDivision(dps.getDistrict().getDivision().getName());
            }
        }

        // Customer
        if (parcel.getCustomer() != null) {
            dto.setCustomerId(parcel.getCustomer().getId());
            if (parcel.getCustomer().getUser() != null) {
                dto.setCustomerName(parcel.getCustomer().getUser().getName());
                dto.setCustomerPhone(parcel.getCustomer().getUser().getPhone());
            }
        }

        if (parcel.getBookedByAgent() != null) {
            Agent agent = parcel.getBookedByAgent();
            dto.setAgentId(agent.getId());
            if (agent.getUser() != null) {
                dto.setAgentName(agent.getUser().getName());
            }
            if (agent.getHub() != null) {
                dto.setAgentHubName(agent.getHub().getName());
            }
        }

        // Rider
        if (parcel.getRider() != null) {
            dto.setRiderId(parcel.getRider().getId());
            if (parcel.getRider().getUser() != null) {
                dto.setRiderName(parcel.getRider().getUser().getName());
                dto.setRiderPhone(parcel.getRider().getUser().getPhone());
            }
        }

        // History
        if (parcel.getHistory() == null || parcel.getHistory().isEmpty()) {
            dto.setHistory(Collections.emptyList());
        } else {
            dto.setHistory(parcel.getHistory().stream()
                    .map(ParcelMapper::toHistoryEntry)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private static ParcelResponseDTO.HistoryEntry toHistoryEntry(ParcelHistory h) {
        ParcelResponseDTO.HistoryEntry e = new ParcelResponseDTO.HistoryEntry();
        e.setId(h.getId());
        e.setStatus(h.getStatus());
        e.setNote(h.getNote());
        e.setLocation(h.getLocation());
        e.setTimestamp(h.getCreatedAt());


        Rider performedBy = h.getPerformedBy();
        if (performedBy != null) {
            e.setRiderId(performedBy.getId());
            e.setPerformedBy(performedBy.getUser() != null ? performedBy.getUser().getName() : "System");
        } else {
            e.setPerformedBy("System");
        }

        return e;
    }

}
