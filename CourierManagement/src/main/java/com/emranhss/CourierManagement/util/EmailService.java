package com.emranhss.CourierManagement.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;


    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;


    public void sendSimpleMail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);

        messageHelper.setFrom(fromEmail);
        messageHelper.setTo(to);
        messageHelper.setSubject(subject);
        messageHelper.setText(body, true);

        try {
            javaMailSender.send(message);
            System.out.println("Mail sent successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // ── Email verification ───────────────────────────────────────
    public void sendVerificationEmail(String to, String name, String token) throws MessagingException {

        String link = frontendUrl + "/api/auth/verify-email?token=" + token;

        String body = """
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
                <h2 style="color:#0f172a;">Welcome to CourierBD, %s!</h2>
                <p>Please confirm your email address to activate your account.</p>
                <p style="margin: 24px 0;">
                    <a href="%s"
                       style="background:#3b82f6; color:#fff; padding:12px 24px;
                              border-radius:8px; text-decoration:none; font-weight:bold;">
                       Verify Email
                    </a>
                </p>
                <p style="color:#64748b; font-size: 13px;">
                    This link expires in 1 hour. If you didn't create an account,
                    you can safely ignore this email.
                </p>
            </div>
            """.formatted(name, link);

        sendSimpleMail(to, "Verify your CourierBD account", body);
    }


    // ── Password reset ────────────────────────────────────────────
    public void sendPasswordResetEmail(String to, String name, String token) throws MessagingException {

        String link = frontendUrl + "/api/auth/reset-password?token=" + token;

        String body = """
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
                <h2 style="color:#0f172a;">Password Reset Request</h2>
                <p>Hi %s, we received a request to reset your password.</p>
                <p style="margin: 24px 0;">
                    <a href="%s"
                       style="background:#ef4444; color:#fff; padding:12px 24px;
                              border-radius:8px; text-decoration:none; font-weight:bold;">
                       Reset Password
                    </a>
                </p>
                <p style="color:#64748b; font-size: 13px;">
                    This link expires in 15 minutes. If you didn't request this,
                    you can safely ignore this email — your password will not change.
                </p>
            </div>
            """.formatted(name, link);

        sendSimpleMail(to, "Reset your CourierBD password", body);
    }



}
