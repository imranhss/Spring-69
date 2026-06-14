package com.emranhss.CourierManagement.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration; // milliseconds e.g. 86400000 = 24h

    @Value("${jwt.verification-expiration}")
    private long verificationExpiration; // milliseconds e.g. 86400000 = 24h

    @Value("${jwt.reset-expiration}")
    private long resetExpiration; // milliseconds e.g. 86400000 = 24h


    // Generate token from email
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())
                .compact();
    }


    // ── Password reset token (short-lived, single purpose) ─────────
    public String generateResetToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim("purpose", "PASSWORD_RESET")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + resetExpiration))
                .signWith(getKey())
                .compact();
    }

    // ── Email verification token (short-lived, single purpose) ────
    public String generateVerificationToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim("purpose", "EMAIL_VERIFICATION")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + verificationExpiration))
                .signWith(getKey())
                .compact();
    }


    // Extract email (subject) from token
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // Extract role claim from token
    public String extractRole(String token) {
        return (String) getClaims(token).get("role");
    }


    // Validate token — checks signature + expiry
    public boolean isValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }


    public String extractPurpose(String token) {
        return (String) getClaims(token).get("purpose");
    }


    // Validates token AND checks it was issued for the expected purpose
    public boolean isValidForPurpose(String token, String expectedPurpose) {
        try {
            Claims claims = getClaims(token);
            return expectedPurpose.equals(claims.get("purpose"));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

//    public boolean isTokenValid(String token, UserDetails userDetails) {
//        final String username = extractEmail(token);
//        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
//    }


//    private boolean isTokenExpired(String token) {
//        return getClaims(token).getExpiration().before(new Date());
//    }


    // ── Private helpers ───────────────────────────────────────────

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }


}
