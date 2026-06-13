package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.dto.response.CustomerResponseDTO;
import com.emranhss.CourierManagement.dto.mapper.CustomerMapper;
import com.emranhss.CourierManagement.dto.request.CustomerRequestDTO;
import com.emranhss.CourierManagement.entity.Customer;
import com.emranhss.CourierManagement.entity.PoliceStation;
import com.emranhss.CourierManagement.entity.User;
import com.emranhss.CourierManagement.enums.Role;
import com.emranhss.CourierManagement.repository.CustomerRepository;
import com.emranhss.CourierManagement.repository.PoliceStationRepository;
import com.emranhss.CourierManagement.repository.UserRepository;
import com.emranhss.CourierManagement.service.CustomerService;
import com.emranhss.CourierManagement.util.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final PoliceStationRepository policeStationRepository;
    private final EmailService emailService;
    private  final PasswordEncoder encoder;


    @Value("${image.upload.dir}")
    private String uploadDir;

    @Transactional
    @Override
    public CustomerResponseDTO create(CustomerRequestDTO dto, MultipartFile image) {

        // 1. Create and save User account
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(encoder.encode(dto.getPassword())); // encode in security layer
        user.setRole(Role.CUSTOMER);
        user.setActive(false);

        if (dto.getPoliceStationId() != null) {
            policeStationRepository.findById(dto.getPoliceStationId())
                    .ifPresent(user::setPoliceStation);
        }

        User savedUser = userRepository.save(user);

        // 2. Create Customer profile
        Customer customer = new Customer();
        customer.setUser(savedUser);
        customer.setAddress(dto.getAddress());
        customer.setGender(dto.getGender());

        if (dto.getDob() != null && !dto.getDob().isBlank()) {
            try {
                customer.setDob(new SimpleDateFormat("yyyy-MM-dd").parse(dto.getDob()));
            } catch (ParseException e) {
                throw new RuntimeException("Invalid date format. Use yyyy-MM-dd");
            }
        }

        if (dto.getPoliceStationId() != null) {
            policeStationRepository.findById(dto.getPoliceStationId())
                    .ifPresent(customer::setPoliceStation);
        }

        if (image != null && !image.isEmpty()) {
            customer.setImage(uploadImage(image, dto.getName()));
        }

        Customer saved = customerRepository.save(customer);

        return CustomerMapper.toDTO(
                customerRepository.findByIdWithDetails(saved.getId()).orElse(saved)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponseDTO> getAll() {
        return customerRepository.findAllWithDetails()
                .stream()
                .map(CustomerMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getById(Long id) {
        Customer customer = customerRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return CustomerMapper.toDTO(customer);
    }

    @Transactional
    @Override
    public CustomerResponseDTO update(Long id, CustomerRequestDTO dto, MultipartFile image) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        // Update User fields
        User user = customer.getUser();
        if (dto.getName() != null)  user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        // Update profile fields
        if (dto.getAddress() != null) customer.setAddress(dto.getAddress());
        if (dto.getGender() != null)  customer.setGender(dto.getGender());
        if (dto.getDob() != null && !dto.getDob().isBlank()) {
            try {
                customer.setDob(new SimpleDateFormat("yyyy-MM-dd").parse(dto.getDob()));
            } catch (ParseException e) {
                throw new RuntimeException("Invalid date format. Use yyyy-MM-dd");
            }
        }

        if (dto.getPoliceStationId() != null) {
            PoliceStation ps = policeStationRepository.findById(dto.getPoliceStationId())
                    .orElseThrow(() -> new RuntimeException("PoliceStation not found"));
            customer.setPoliceStation(ps);
            user.setPoliceStation(ps);
        }

        if (image != null && !image.isEmpty()) {
            customer.setImage(uploadImage(image, user.getName()));
        }

        Customer saved = customerRepository.save(customer);

        return CustomerMapper.toDTO(
                customerRepository.findByIdWithDetails(saved.getId()).orElse(saved)
        );
    }

    @Override
    public void delete(Long id) {
        customerRepository.deleteById(id);
    }

    // ── Image upload ──────────────────────────────────────────────
    private String uploadImage(MultipartFile file, String name) {
        try {
            Path path = Paths.get(uploadDir, "customer");
            if (!Files.exists(path)) Files.createDirectories(path);

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

    public  void sendMailToCustomer(Customer c){

        String subject = "Welcome to Our Service – Confirm Your Registration";

        String mailText = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "  body { font-family: Arial, sans-serif; line-height: 1.6; }"
                + "  .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }"
                + "  .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0; }"
                + "  .content { padding: 20px; }"
                + "  .footer { font-size: 0.9em; color: #777; margin-top: 20px; text-align: center; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "  <div class='container'>"
                + "    <div class='header'>"
                + "      <h2>Welcome to Our Platform</h2>"
                + "    </div>"
                + "    <div class='content'>"
                + "      <p>Dear " + c.getUser().getName() + ",</p>"
                + "      <p>Thank you for registering with us. We are excited to have you on board!</p>"
                + "      <p>Please confirm your email address to activate your account and get started.</p>"
                + "      <p>If you have any questions or need help, feel free to reach out to our support team.</p>"
                + "      <br>"
                + "      <p>Best regards,<br>The Support Team</p>"
                + "      <p>To Activate Your Account, please click the following link:</p>"
                + "      <p><a href=\"" + "" + "\">Activate Account</a></p>"
                + "    </div>"
                + "    <div class='footer'>"
                + "      &copy; " + java.time.Year.now() + " YourCompany. All rights reserved."
                + "    </div>"
                + "  </div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendSimpleMail(c.getUser().getEmail(), subject, mailText);
        }  catch (MessagingException e) {
            throw new RuntimeException(e);
        }


    }

}










