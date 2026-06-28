package com.emranhss.CourierManagement.serviceimp;


import com.emranhss.CourierManagement.dto.mapper.CustomerMapper;
import com.emranhss.CourierManagement.dto.response.AgentResponseDTO;
import com.emranhss.CourierManagement.dto.response.CustomerResponseDTO;
import com.emranhss.CourierManagement.dto.response.ParcelResponseDTO;
import com.emranhss.CourierManagement.dto.mapper.AgentMapper;
import com.emranhss.CourierManagement.dto.mapper.ParcelMapper;
import com.emranhss.CourierManagement.dto.request.AgentParcelRequestDTO;
import com.emranhss.CourierManagement.dto.request.AgentRequestDTO;
import com.emranhss.CourierManagement.dto.request.StatusUpdateRequestDTO;
import com.emranhss.CourierManagement.entity.*;
import com.emranhss.CourierManagement.enums.*;
import com.emranhss.CourierManagement.repository.*;
import com.emranhss.CourierManagement.service.AgentService;
import com.emranhss.CourierManagement.util.parcel.TrackingCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgentServiceImpl implements AgentService {


    private final AgentRepository agentRepository;
    private final UserRepository userRepository;
    private final PoliceStationRepository policeStationRepository;
    private final ParcelRepository parcelRepository;
    private final RiderRepository riderRepository;
    private final TrackingCodeGenerator trackingCodeGenerator;
    private  final PasswordEncoder encoder;
    private final AuthService authService;


    @Value("${image.upload.dir}")
    private String uploadDir;


    @Override
    @Transactional
    public AgentResponseDTO create(AgentRequestDTO dto, MultipartFile image) {

        // 1. Validate hub exists
        PoliceStation hub = policeStationRepository.findById(dto.getHubId())
                .orElseThrow(() -> new RuntimeException(
                        "Hub (PoliceStation) not found with id: " + dto.getHubId()));

        // 2. Create User account with AGENT role
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(encoder.encode(dto.getPassword()));
        user.setRole(Role.AGENT);
        user.setPoliceStation(hub);
        user.setActive(false);

        User savedUser = userRepository.save(user);

        // 3. Create Agent profile
        Agent agent = new Agent();
        agent.setUser(savedUser);
        agent.setHub(hub);
        agent.setDesignation(dto.getDesignation());
        agent.setActive(true);

        if (image != null && !image.isEmpty()) {
            agent.setImage(uploadImage(image, dto.getName()));
        }

        Agent saved = agentRepository.save(agent);
        authService.sendVerificationEmail(saved.getUser().getEmail());
        return AgentMapper.toDTO(
                agentRepository.findByIdWithDetails(saved.getId()).orElse(saved));

    }

    @Override
    @Transactional(readOnly = true)
    public List<AgentResponseDTO> getAll() {
        return agentRepository.findAllWithDetails()
                .stream().map(AgentMapper::toDTO).collect(Collectors.toList());
    }


    @Override
    @Transactional(readOnly = true)
    public AgentResponseDTO getById(Long id) {
        return AgentMapper.toDTO(
                agentRepository.findByIdWithDetails(id)
                        .orElseThrow(() -> new RuntimeException(
                                "Agent not found with id: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AgentResponseDTO> getByHub(Long hubId) {
        return agentRepository.findByHubId(hubId)
                .stream().map(AgentMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public AgentResponseDTO update(Long id, AgentRequestDTO dto, MultipartFile image) {

        Agent agent = agentRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Agent not found with id: " + id));

        // Update User fields
        User user = agent.getUser();
        if (dto.getName() != null)  user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        // Update agent profile
        if (dto.getDesignation() != null) agent.setDesignation(dto.getDesignation());

        // Reassign hub if changed
        if (dto.getHubId() != null) {
            PoliceStation hub = policeStationRepository.findById(dto.getHubId())
                    .orElseThrow(() -> new RuntimeException("Hub not found"));
            agent.setHub(hub);
            user.setPoliceStation(hub);
            userRepository.save(user);
        }

        if (image != null && !image.isEmpty()) {
            agent.setImage(uploadImage(image, user.getName()));
        }

        Agent saved = agentRepository.save(agent);
        return AgentMapper.toDTO(
                agentRepository.findByIdWithDetails(saved.getId()).orElse(saved));
    }

    @Override
    public void delete(Long id) {
        agentRepository.deleteById(id);
    }

    // ── Hub parcel booking ────────────────────────────────────────

    @Transactional
    @Override
    public ParcelResponseDTO bookParcel(AgentParcelRequestDTO dto) {

        // 1. Resolve agent
        Agent agent = agentRepository.findByIdWithDetails(dto.getAgentId())
                .orElseThrow(() -> new RuntimeException(
                        "Agent not found with id: " + dto.getAgentId()));

        Parcel parcel = new Parcel();
        parcel.setBookingSource(BookingSource.AGENT);
        parcel.setBookedByAgent(agent);

        // 2. Sender info — required for walk-in
        if (dto.getSenderName() == null || dto.getSenderPhone() == null) {
            throw new RuntimeException("Sender name and phone are required for hub booking");
        }
        parcel.setSenderName(dto.getSenderName());
        parcel.setSenderPhone(dto.getSenderPhone());
        parcel.setSenderAddress(dto.getSenderAddress());

        // 3. Origin = agent's own hub by default, override if provided
        PoliceStation origin = dto.getOriginPoliceStationId() != null
                ? policeStationRepository.findById(dto.getOriginPoliceStationId())
                  .orElseThrow(() -> new RuntimeException("Origin hub not found"))
                : agent.getHub();

        parcel.setOriginPoliceStation(origin);

        // 4. Receiver
        parcel.setReceiverName(dto.getReceiverName());
        parcel.setReceiverPhone(dto.getReceiverPhone());
        parcel.setReceiverAddress(dto.getReceiverAddress());

        if (dto.getDestinationPoliceStationId() != null) {
            parcel.setDestinationPoliceStation(
                    policeStationRepository.findById(dto.getDestinationPoliceStationId())
                            .orElseThrow(() -> new RuntimeException("Destination hub not found")));
        }

        // 5. Parcel details
        parcel.setParcelType(dto.getParcelType());
        parcel.setWeight(dto.getWeight() != null ? dto.getWeight() : 0.5);
        parcel.setDescription(dto.getDescription());
        parcel.setSpecialInstructions(dto.getSpecialInstructions());

        // 6. Service & pricing
        ServiceType serviceType = dto.getServiceType() != null
                ? dto.getServiceType() : ServiceType.STANDARD;
        parcel.setServiceType(serviceType);
        parcel.setPriority(dto.getPriority() != null ? dto.getPriority() : Priority.NORMAL);

        double codAmount = dto.getCodAmount() != null ? dto.getCodAmount() : 0.0;
        parcel.setCodAmount(codAmount);
        parcel.setDeliveryCharge(
                trackingCodeGenerator.calculateCharge(parcel.getWeight(), serviceType, codAmount));


        // 7. Payment
        parcel.setPaymentMethod(dto.getPaymentMethod() != null
                ? dto.getPaymentMethod() : PaymentMethod.COD);
        parcel.setPaymentStatus(PaymentStatus.PENDING);

        // 8. Status & tracking
        parcel.setStatus(ParcelStatus.PENDING);
        parcel.setEstimatedDelivery(estimateDelivery(serviceType));
        parcel.setTrackingCode(trackingCodeGenerator.generateTrackingCode());

        // 9. Initial history entry — booked at hub
        ParcelHistory initial = new ParcelHistory();
        initial.setStatus(ParcelStatus.PENDING.name());
        initial.setNote("Parcel booked at " + origin.getName()
                + " Hub by agent " + agent.getUser().getName());
        initial.setLocation(origin.getName() + " Hub");
        initial.setParcel(parcel);
        parcel.getHistory().add(initial);

        Parcel saved = parcelRepository.save(parcel);
        return ParcelMapper.toDTO(
                parcelRepository.findByIdWithDetails(saved.getId()).orElse(saved));
    }

    // ── Hub parcel queries ────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<ParcelResponseDTO> getHubParcels(Long agentId) {
        Agent agent = agentRepository.findByIdWithDetails(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return parcelRepository.findByHubWithDetails(agent.getHub().getId())
                .stream().map(ParcelMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParcelResponseDTO> getHubParcelsByStatus(Long agentId, ParcelStatus status) {
        Agent agent = agentRepository.findByIdWithDetails(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return parcelRepository
                .findByHubAndStatusWithDetails(agent.getHub().getId(), status)
                .stream().map(ParcelMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ParcelResponseDTO updateParcelStatus(Long agentId, Long parcelId, StatusUpdateRequestDTO dto) {

        Parcel parcel = parcelRepository.findById(parcelId)
                .orElseThrow(() -> new RuntimeException("Parcel not found"));

        Agent agent = agentRepository.findByIdWithDetails(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        parcel.setStatus(ParcelStatus.valueOf(dto.getStatus()));

        // ── Build a meaningful auto note ──────────────────────────────
        String autoNote = dto.getNote();
        String autoLocation = dto.getLocation();

        if (ParcelStatus.valueOf(dto.getStatus()) == ParcelStatus.IN_TRANSIT
                && dto.getNextHubPoliceStationId() != null) {

            PoliceStation nextHub = policeStationRepository
                    .findById(dto.getNextHubPoliceStationId())
                    .orElseThrow(() -> new RuntimeException("Hub not found"));

            parcel.setCurrentHub(nextHub);

            // Auto-generate note if agent left it blank
            if (autoNote == null || autoNote.isBlank()) {
                autoNote = "Dispatched from " + agent.getHub().getName()
                        + " → " + nextHub.getName();
            }

            if (autoLocation == null || autoLocation.isBlank()) {
                autoLocation = agent.getHub().getName();
            }
        }

        if (ParcelStatus.valueOf(dto.getStatus()) == ParcelStatus.AT_HUB) {
            parcel.setCurrentHub(agent.getHub());

            if (autoNote == null || autoNote.isBlank()) {
                autoNote = "Arrived at " + agent.getHub().getName();
            }

            if (autoLocation == null || autoLocation.isBlank()) {
                autoLocation = agent.getHub().getName();
            }
        }

        if (ParcelStatus.valueOf(dto.getStatus()) == ParcelStatus.OUT_FOR_DELIVERY
                && dto.getRiderId() != null) {

            Rider rider = riderRepository.findById(dto.getRiderId())
                    .orElseThrow(() -> new RuntimeException("Rider not found"));

            parcel.setRider(rider);

            if (autoNote == null || autoNote.isBlank()) {
                autoNote = "Assigned to rider " + rider.getUser().getName()
                        + " (" + rider.getVehicleType() + ")";
            }

            if (autoLocation == null || autoLocation.isBlank()) {
                autoLocation = agent.getHub().getName();
            }
        }

        if (ParcelStatus.valueOf(dto.getStatus()) == ParcelStatus.DELIVERED) {
            if (autoNote == null || autoNote.isBlank()) {
                autoNote = "Delivered successfully";
            }
        }

        // ── Record history entry ──────────────────────────────────────
        ParcelHistory history = new ParcelHistory();
        history.setStatus(dto.getStatus());
        history.setNote(autoNote);
        history.setLocation(autoLocation);
        history.setParcel(parcel);
//        history.setPerformedBy(agent.getUser().getName()); // who did it
        parcel.getHistory().add(history);

        Parcel saved = parcelRepository.save(parcel);
        return ParcelMapper.toDTO(
                parcelRepository.findByIdWithDetails(saved.getId()).orElse(saved));
    }
//    public ParcelResponseDTO updateParcelStatus(Long agentId, Long parcelId,
//                                                StatusUpdateRequestDTO dto) {
//        Agent agent = agentRepository.findByIdWithDetails(agentId)
//                .orElseThrow(() -> new RuntimeException("Agent not found"));
//
//        Parcel parcel = parcelRepository.findByIdWithDetails(parcelId)
//                .orElseThrow(() -> new RuntimeException("Parcel not found"));
//
//        Rider r= null;
//        if(dto.getRiderId() != null){
//                r = riderRepository.findById(dto.getRiderId())
//                        .orElseThrow(() -> new RuntimeException("Eider not found"));
//        }
//
//        // Verify parcel passes through this agent's hub
//        Long hubId = agent.getHub().getId();
//        boolean isOrigin      = parcel.getOriginPoliceStation() != null
//                && parcel.getOriginPoliceStation().getId().equals(hubId);
//        boolean isDestination = parcel.getDestinationPoliceStation() != null
//                && parcel.getDestinationPoliceStation().getId().equals(hubId);
//
//        if (!isOrigin && !isDestination) {
//            throw new RuntimeException(
//                    "This parcel does not pass through your hub ("
//                            + agent.getHub().getName() + ")");
//        }
//
//        // Parse and set new status
//        ParcelStatus newStatus;
//        try {
//            newStatus = ParcelStatus.valueOf(dto.getStatus().toUpperCase());
//        } catch (IllegalArgumentException e) {
//            throw new RuntimeException("Invalid status: " + dto.getStatus());
//        }
//
//
//        parcel.setStatus(newStatus);
//
//        parcel.setRider(r);
//
//        // Auto-mark COD paid on delivery
//        if (newStatus == ParcelStatus.DELIVERED
//                && parcel.getPaymentMethod() == PaymentMethod.COD) {
//            parcel.setPaymentStatus(PaymentStatus.PAID);
//        }
//
//        // History entry — note which hub made the update
//        ParcelHistory h = new ParcelHistory();
//        h.setStatus(newStatus.name());
//        h.setNote(dto.getNote() != null ? dto.getNote()
//                : "Status updated at " + agent.getHub().getName() + " Hub");
//        h.setLocation(dto.getLocation() != null
//                ? dto.getLocation() : agent.getHub().getName() + " Hub");
//        h.setParcel(parcel);
//
//        if (dto.getRiderId() != null) {
//            riderRepository.findById(dto.getRiderId())
//                    .ifPresent(h::setPerformedBy);
//        }
//
//        parcel.getHistory().add(h);
//        return ParcelMapper.toDTO(parcelRepository.save(parcel));
//    }


    @Override
    public AgentResponseDTO getByUserId(Long id) {
        Agent a = agentRepository.findByUserId(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        return AgentMapper.toDTO(a);
    }


    private LocalDate estimateDelivery(ServiceType serviceType) {
        int days = switch (serviceType) {
            case EXPRESS, OVERNIGHT -> 1;
            case SAME_DAY -> 0;
            default -> 3;
        };
        return LocalDate.now().plusDays(days);
    }

    private String uploadImage(MultipartFile file, String name) {
        try {
            Path path = Paths.get(uploadDir, "agent");

            if (!Files.exists(path)) {

                Files.createDirectories(path);
            }

            String ext = "";

            String original = file.getOriginalFilename();

            if (original != null && original.contains("."))
                ext = original.substring(original.lastIndexOf("."));

            String fileName = name.trim().replaceAll("\\s+", "_")
                    + "_" + UUID.randomUUID() + ext;
            Files.copy(file.getInputStream(), path.resolve(fileName));
            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }


}
