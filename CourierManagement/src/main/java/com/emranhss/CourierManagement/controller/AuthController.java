package com.emranhss.CourierManagement.controller;


import com.emranhss.CourierManagement.dto.request.ForgotPasswordRequestDTO;
import com.emranhss.CourierManagement.dto.request.LoginRequestDTO;
import com.emranhss.CourierManagement.dto.request.ResetPasswordRequestDTO;
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


    // GET /api/auth/verify-email?token=...
    // User clicks this link from their email
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok("Email verified successfully. You can now log in.");
    }

    // ── Password reset ──────────────────────────────────────────────

    // POST /api/auth/forgot-password
    // Body: { "email": "fatema@gmail.com" }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequestDTO dto) {
        authService.forgotPassword(dto);
        return ResponseEntity.ok("Password reset link sent to " + dto.getEmail());
    }

    // POST /api/auth/reset-password
    // Body: { "token": "...", "newPassword": "newPass123" }
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequestDTO dto) {
        authService.resetPassword(dto);
        return ResponseEntity.ok("Password reset successful. You can now log in with your new password.");
    }


}
