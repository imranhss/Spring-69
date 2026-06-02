package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.entity.Customer;
import com.emranhss.CourierManagement.entity.Rider;
import com.emranhss.CourierManagement.entity.User;
import com.emranhss.CourierManagement.repository.RiderRepository;
import com.emranhss.CourierManagement.repository.UserRepository;
import com.emranhss.CourierManagement.service.RiderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RiderServiceImpl implements RiderService {

    @Autowired
    private RiderRepository riderRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("F:/JEE-69/Spring/Code/Spring-69/assets/")
    private String uploadDir;

    @Override
    public Rider save(Rider r, MultipartFile image) {

        if (image != null && !image.isEmpty()) {

            String filename = saveImageForRider(image, r);
            r.setImage(filename);
        }


        User user = new User();

        user.setName(r.getName());
        user.setEmail(r.getEmail());
        user.setPhone(r.getPhone());
        user.setPassword(r.getPassword());
        user.setRole("RIDER");

        User savedUser = userRepository.save(user);

        r.setUser(savedUser);

        return riderRepository.save(r);
    }

    @Override
    public List<Rider> findAll() {
        return List.of();
    }

    @Override
    public Optional<Rider> getById(Integer id) {
        return Optional.empty();
    }

    @Override
    public void delete(Integer id) {

    }

    public String saveImageForRider(MultipartFile file, Rider r) {

        Path uploadPath = Paths.get(uploadDir + "/rider");
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectory(uploadPath);

            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        String riderName = r.getName();
        String fileName = riderName.trim().replaceAll("\\s+", "_");

        String savedFileName = fileName + "_" + UUID.randomUUID().toString();

        try {
            Path filePath = uploadPath.resolve(savedFileName);
            Files.copy(file.getInputStream(), filePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return savedFileName;

    }


}
