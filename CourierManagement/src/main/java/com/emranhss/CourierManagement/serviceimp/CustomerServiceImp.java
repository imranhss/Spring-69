package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.entity.Customer;
import com.emranhss.CourierManagement.entity.User;
import com.emranhss.CourierManagement.repository.CustomerRepository;
import com.emranhss.CourierManagement.repository.UserRepository;
import com.emranhss.CourierManagement.service.CustomerService;
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
public class CustomerServiceImp implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("F:/JEE-69/Spring/Code/Spring-69/assets/")
    private String uploadDir;


    @Override
    public Customer save(Customer c, MultipartFile imageFile) {


        if (imageFile != null && !imageFile.isEmpty()) {
            // Save image for both User and JobSeeker
            String filename = saveImageForCustomer(imageFile, c);
            c.setImage(filename);
        }


        User u = new User();

        u.setName(c.getName());
        u.setEmail(c.getEmail());
        u.setPhone(c.getPhone());
        u.setPassword(c.getPassword());
        u.setRole("CUSTOMER");

        User savedUser = userRepository.save(u);

        c.setUser(savedUser);
        return customerRepository.save(c);
    }

    @Override
    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    @Override
    public Optional<Customer> getById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        customerRepository.deleteById(id);
    }



    public String saveImageForCustomer(MultipartFile file, Customer c) {

        Path uploadPath = Paths.get(uploadDir + "/customer");
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectory(uploadPath);

            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        String customerName = c.getName();
        String fileName = customerName.trim().replaceAll("\\s+", "_");

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
