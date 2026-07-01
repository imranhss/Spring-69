package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.dto.response.ParcelResponseDTO;
import com.emranhss.CourierManagement.dto.mapper.ParcelMapper;
import com.emranhss.CourierManagement.dto.request.ParcelRequestDTO;
import com.emranhss.CourierManagement.dto.request.StatusUpdateRequestDTO;
import com.emranhss.CourierManagement.entity.Customer;
import com.emranhss.CourierManagement.entity.Parcel;
import com.emranhss.CourierManagement.entity.ParcelHistory;
import com.emranhss.CourierManagement.entity.Rider;
import com.emranhss.CourierManagement.enums.*;
import com.emranhss.CourierManagement.repository.CustomerRepository;
import com.emranhss.CourierManagement.repository.ParcelRepository;
import com.emranhss.CourierManagement.repository.PoliceStationRepository;
import com.emranhss.CourierManagement.repository.RiderRepository;
import com.emranhss.CourierManagement.service.ParcelService;
import com.emranhss.CourierManagement.util.parcel.TrackingCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParcelServiceImpl implements ParcelService {


    private final ParcelRepository parcelRepository;
    private final CustomerRepository customerRepository;
    private final RiderRepository riderRepository;
    private final PoliceStationRepository policeStationRepository;
    private final TrackingCodeGenerator trackingCodeGenerator;


    @Transactional
    @Override
    public ParcelResponseDTO book(ParcelRequestDTO dto) {

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException(
                        "Customer not found with id: " + dto.getCustomerId()));

        Parcel parcel = new Parcel();

        // Pre-fill sender from customer if not provided
        parcel.setSenderName(dto.getSenderName() != null ? dto.getSenderName()
                : (customer.getUser() != null ? customer.getUser().getName() : ""));
        parcel.setSenderPhone(dto.getSenderPhone() != null ? dto.getSenderPhone()
                : (customer.getUser() != null ? customer.getUser().getPhone() : ""));
        parcel.setSenderAddress(dto.getSenderAddress() != null ? dto.getSenderAddress()
                : customer.getAddress());

        parcel.setReceiverName(dto.getReceiverName());
        parcel.setReceiverPhone(dto.getReceiverPhone());
        parcel.setReceiverAddress(dto.getReceiverAddress());

        parcel.setParcelType(dto.getParcelType());
        parcel.setWeight(dto.getWeight() != null ? dto.getWeight() : 0.5);
        parcel.setDescription(dto.getDescription());
        parcel.setSpecialInstructions(dto.getSpecialInstructions());
        parcel.setBookingSource(BookingSource.ONLINE);

        ServiceType serviceType = dto.getServiceType() != null
                ? dto.getServiceType() : ServiceType.STANDARD;
        parcel.setServiceType(serviceType);
        parcel.setPriority(dto.getPriority() != null ? dto.getPriority() : Priority.NORMAL);

        double codAmount = dto.getCodAmount() != null ? dto.getCodAmount() : 0.0;
        parcel.setCodAmount(codAmount);
        parcel.setDeliveryCharge(
                trackingCodeGenerator.calculateCharge(parcel.getWeight(), serviceType, codAmount));

        parcel.setPaymentMethod(dto.getPaymentMethod() != null
                ? dto.getPaymentMethod() : PaymentMethod.COD);
        parcel.setPaymentStatus(PaymentStatus.PENDING);
        parcel.setStatus(ParcelStatus.PENDING);
        parcel.setEstimatedDelivery(estimateDelivery(serviceType));
        parcel.setCustomer(customer);

        if (dto.getOriginPoliceStationId() != null) {
            parcel.setOriginPoliceStation(
                    policeStationRepository.findById(dto.getOriginPoliceStationId())
                            .orElseThrow(() -> new RuntimeException("Origin police station not found")));
        }
        if (dto.getDestinationPoliceStationId() != null) {
            parcel.setDestinationPoliceStation(
                    policeStationRepository.findById(dto.getDestinationPoliceStationId())
                            .orElseThrow(() -> new RuntimeException("Destination police station not found")));
        }

        parcel.setTrackingCode(trackingCodeGenerator.generateTrackingCode());

        // Initial history entry
        ParcelHistory initial = new ParcelHistory();
        initial.setStatus(ParcelStatus.PENDING.name());
        initial.setNote("Parcel booked successfully");
        initial.setLocation(parcel.getOriginPoliceStation() != null
                ? parcel.getOriginPoliceStation().getName() + " Hub" : "Main Hub");
        initial.setParcel(parcel);
        parcel.getHistory().add(initial);

        Parcel saved = parcelRepository.save(parcel);
        return ParcelMapper.toDTO(
                parcelRepository.findByIdWithDetails(saved.getId()).orElse(saved));
    }


    @Override
    @Transactional(readOnly = true)
    public List<ParcelResponseDTO> getByCustomer(Long customerId) {
        return parcelRepository.findByCustomerIdWithDetails(customerId)
                .stream().map(ParcelMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ParcelResponseDTO track(String trackingCode) {
        return ParcelMapper.toDTO(
                parcelRepository.findByTrackingCodeWithDetails(trackingCode)
                        .orElseThrow(() -> new RuntimeException(
                                "No parcel found with tracking code: " + trackingCode)));
    }

    @Transactional
    @Override
    public ParcelResponseDTO cancel(Long parcelId, Long customerId) {
        Parcel parcel = parcelRepository.findByIdWithDetails(parcelId)
                .orElseThrow(() -> new RuntimeException("Parcel not found"));

        if (!parcel.getCustomer().getId().equals(customerId))
            throw new RuntimeException("You can only cancel your own parcels");

        if (parcel.getStatus() != ParcelStatus.PENDING)
            throw new RuntimeException("Cannot cancel — status is: " + parcel.getStatus()
                    + ". Only PENDING parcels can be cancelled.");

        parcel.setStatus(ParcelStatus.CANCELLED);

        ParcelHistory h = new ParcelHistory();
        h.setStatus(ParcelStatus.CANCELLED.name());
        h.setNote("Cancelled by customer");
        h.setLocation(parcel.getOriginPoliceStation() != null
                ? parcel.getOriginPoliceStation().getName() : "");
        h.setParcel(parcel);
        parcel.getHistory().add(h);

        return ParcelMapper.toDTO(parcelRepository.save(parcel));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParcelResponseDTO> getAll() {
        return parcelRepository.findAll()
                .stream().map(ParcelMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ParcelResponseDTO getById(Long id) {
        return ParcelMapper.toDTO(
                parcelRepository.findByIdWithDetails(id)
                        .orElseThrow(() -> new RuntimeException("Parcel not found")));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParcelResponseDTO> getPendingUnassigned() {
        return parcelRepository.findByStatusAndRiderIsNull(ParcelStatus.PENDING)
                .stream().map(ParcelMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ParcelResponseDTO assignRider(Long parcelId, Long riderId) {
        Parcel parcel = parcelRepository.findByIdWithDetails(parcelId)
                .orElseThrow(() -> new RuntimeException("Parcel not found"));
        Rider rider = riderRepository.findByIdWithZones(riderId)
                .orElseThrow(() -> new RuntimeException("Rider not found"));

        parcel.setRider(rider);
        parcel.setStatus(ParcelStatus.PICKED_UP);

        ParcelHistory h = new ParcelHistory();
        h.setStatus(ParcelStatus.PICKED_UP.name());
        h.setNote("Assigned to " + rider.getUser().getName() + " and picked up");
        h.setLocation(parcel.getOriginPoliceStation() != null
                ? parcel.getOriginPoliceStation().getName() + " Hub" : "Hub");
        h.setPerformedBy(rider);
        h.setParcel(parcel);
        parcel.getHistory().add(h);

        return ParcelMapper.toDTO(parcelRepository.save(parcel));
    }

    @Transactional
    @Override
    public ParcelResponseDTO updateStatus(Long parcelId, StatusUpdateRequestDTO dto) {
        Parcel parcel = parcelRepository.findByIdWithDetails(parcelId)
                .orElseThrow(() -> new RuntimeException("Parcel not found"));

        ParcelStatus newStatus;
        try {
            newStatus = ParcelStatus.valueOf(dto.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + dto.getStatus());
        }

        parcel.setStatus(newStatus);

        if (newStatus == ParcelStatus.DELIVERED
                && parcel.getPaymentMethod() == PaymentMethod.COD) {
            parcel.setPaymentStatus(PaymentStatus.PAID);
        }

        ParcelHistory h = new ParcelHistory();
        h.setStatus(newStatus.name());
        h.setNote(dto.getNote() != null ? dto.getNote() : "Status updated");
        h.setLocation(dto.getLocation() != null ? dto.getLocation() : "");
        h.setParcel(parcel);

        if (dto.getRiderId() != null)
            riderRepository.findById(dto.getRiderId()).ifPresent(h::setPerformedBy);

        parcel.getHistory().add(h);
        return ParcelMapper.toDTO(parcelRepository.save(parcel));
    }

    @Override
    public void delete(Long id) {
        parcelRepository.deleteById(id);
    }

    @Override
    public double calculateCharge(double weight, String serviceType, double codAmount) {
        try {
            return trackingCodeGenerator.calculateCharge(
                    weight, ServiceType.valueOf(serviceType.toUpperCase()), codAmount);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid serviceType: " + serviceType);
        }
    }


    @Override
    @Transactional(readOnly = true)
    public List<ParcelResponseDTO> getByRider(Long riderId) {
        return parcelRepository.findByRiderIdWithDetails(riderId)
                .stream().map(ParcelMapper::toDTO).collect(Collectors.toList());
    }



    private LocalDate estimateDelivery(ServiceType serviceType) {
        int days = switch (serviceType) {
            case EXPRESS, OVERNIGHT -> 1;
            case SAME_DAY           -> 0;
            default                 -> 3;
        };
        return LocalDate.now().plusDays(days);
    }


}
