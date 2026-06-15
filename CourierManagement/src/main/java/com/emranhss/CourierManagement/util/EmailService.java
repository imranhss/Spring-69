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

        messageHelper.setFrom(fromEmail);  // Optional Line

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
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="margin:0; padding:0; background-color:#f1f5f9; font-family:Arial, sans-serif;">
                
                    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
                        <tr>
                            <td align="center">
                
                                <table width="600" cellpadding="0" cellspacing="0"
                                       style="background:#ffffff; border-radius:16px;
                                              overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                
                                    <!-- Header -->
                                    <tr>
                                        <td align="center"
                                            style="background:linear-gradient(135deg,#2563eb,#1d4ed8);
                                                   padding:40px 20px;">
                                            <h1 style="color:#ffffff; margin:0;">
                                                CourierBD
                                            </h1>
                                            <p style="color:#dbeafe; margin-top:10px;">
                                                Fast & Reliable Courier Service
                                            </p>
                                        </td>
                                    </tr>
                
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:40px; color:#334155;">
                
                                            <h2 style="margin-top:0; color:#0f172a;">
                                                Welcome, %s 👋
                                            </h2>
                
                                            <p style="font-size:16px; line-height:1.7;">
                                                Thank you for registering with CourierBD.
                                                Please verify your email address to activate your account
                                                and start using our courier services.
                                            </p>
                
                                            <div style="text-align:center; margin:35px 0;">
                                                <a href="%s"
                                                   style="display:inline-block;
                                                          background:#2563eb;
                                                          color:#ffffff;
                                                          text-decoration:none;
                                                          padding:14px 32px;
                                                          border-radius:8px;
                                                          font-size:16px;
                                                          font-weight:600;">
                                                    Verify Email
                                                </a>
                                            </div>
                
                                            <p style="font-size:14px; color:#64748b;">
                                                This verification link will expire in
                                                <strong>1 hour</strong>.
                                            </p>
                
                                            <p style="font-size:14px; color:#64748b;">
                                                If you did not create an account, you can safely ignore this email.
                                            </p>
                
                                        </td>
                                    </tr>
                
                                    <!-- Footer -->
                                    <tr>
                                        <td align="center"
                                            style="background:#f8fafc; padding:20px;
                                                   border-top:1px solid #e2e8f0;">
                
                                            <p style="margin:0; color:#64748b; font-size:13px;">
                                                © 2026 CourierBD. All rights reserved.
                                            </p>
                
                                            <p style="margin-top:8px; color:#94a3b8; font-size:12px;">
                                                This is an automated email. Please do not reply.
                                            </p>
                
                                        </td>
                                    </tr>
                
                                </table>
                
                            </td>
                        </tr>
                    </table>
                
                </body>
                </html>
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
