package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.dto.mapper.AgentMapper;
import com.emranhss.CourierManagement.dto.response.RiderResponseDTO;
import com.emranhss.CourierManagement.dto.mapper.RiderMapper;
import com.emranhss.CourierManagement.dto.request.RiderRequestDTO;
import com.emranhss.CourierManagement.entity.Agent;
import com.emranhss.CourierManagement.entity.PoliceStation;
import com.emranhss.CourierManagement.entity.Rider;
import com.emranhss.CourierManagement.entity.User;
import com.emranhss.CourierManagement.repository.PoliceStationRepository;
import com.emranhss.CourierManagement.repository.RiderRepository;
import com.emranhss.CourierManagement.repository.UserRepository;
import com.emranhss.CourierManagement.service.RiderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RiderServiceImpl implements RiderService {

    private final RiderRepository riderRepository;
    private final UserRepository userRepository;
    private final PoliceStationRepository policeStationRepository;
    private  final PasswordEncoder encoder;
    private  final AuthService authService;

    @Value("${image.upload.dir}")
    private String uploadDir;

    @Transactional
    @Override
    public RiderResponseDTO create(RiderRequestDTO dto, MultipartFile image) {

        Rider rider = RiderMapper.toEntity(dto);

        // save user first

        User u = rider.getUser();
        u.setPassword(encoder.encode(dto.getPassword()));
        u.setActive(false);

        User savedUser = userRepository.save(u);
        rider.setUser(savedUser);

        // upload image
        if (image != null && !image.isEmpty()) {
            rider.setImage(uploadImage(image, dto.getName()));
        }

        Set<PoliceStation> zones = dto.getZones()
                .stream()
                .map(z -> policeStationRepository.findById(z.getPoliceStationId())
                        .orElseThrow(() ->
                                new RuntimeException("Zone not found: " + z.getPoliceStationId())))
                .collect(Collectors.toSet());

        rider.setZones(zones);

        Rider saved = riderRepository.save(rider);

        authService.sendVerificationEmail(saved.getUser().getEmail());


        return RiderMapper.toDTO(saved);
    }

    @Override
    public List<RiderResponseDTO> getAll() {
//        List<Rider> riders = riderRepository.findAllRiders();
        List<Rider> riders = riderRepository.findAll();

        return riders.stream()
                .map(RiderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RiderResponseDTO getById(Long id) {
        Rider rider = riderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rider not found"));
        return RiderMapper.toDTO(rider);
    }

    @Override
    public void delete(Long id) {
        riderRepository.deleteById(id);
    }


    @Override
    public RiderResponseDTO getByUserId(Long id) {
        Rider r = riderRepository.findByUserId(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        return RiderMapper.toDTO(r);
    }


    private String uploadImage(MultipartFile file, String name) {

        try {
            Path path = Paths.get(uploadDir, "rider");

            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            String ext = "";
            String original = file.getOriginalFilename();

            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf("."));
            }

            String fileName = name.trim().replaceAll("\\s+", "_")
                    + "_" + UUID.randomUUID()
                    + ext;

            Files.copy(file.getInputStream(), path.resolve(fileName));

            return fileName;

        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }
    }
}