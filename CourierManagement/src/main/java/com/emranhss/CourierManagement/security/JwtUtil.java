package com.emranhss.CourierManagement.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration; // milliseconds e.g. 86400000 = 24h


    // Generate token from email
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey(), SignatureAlgorithm.HS256)
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

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractEmail(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }


    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }


    // ── Private helpers ───────────────────────────────────────────

    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }



}
