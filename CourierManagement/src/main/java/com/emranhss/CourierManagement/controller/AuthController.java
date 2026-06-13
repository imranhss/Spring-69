package com.emranhss.CourierManagement.controller;


import com.emranhss.CourierManagement.dto.request.LoginRequestDTO;
import com.emranhss.CourierManagement.dto.response.LoginResponseDTO;
import com.emranhss.CourierManagement.serviceimp.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/login
    // Body: { "email": "karim@courier.bd", "password": "karim123" }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }


}
