package com.emranhss.CourierManagement.security;

import com.emranhss.CourierManagement.serviceimp.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 *
 * This filter runs once for every incoming HTTP request.
 * It checks whether a valid JWT token exists in the
 * Authorization header and, if valid, authenticates the user.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    /**
     * Utility class used for JWT operations
     * such as validation and extracting claims.
     */
    private final JwtUtil jwtUtil;

    /**
     * Custom UserDetailsService implementation
     * used to load user information from the database.
     */
    private final CustomUserDetailsService userDetailsService;

    /**
     * This method executes for every request.
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // ============================================================
        // STEP 1: Read the Authorization header
        // Example:
        // Authorization: Bearer eyJhbGciOiJIUzI1NiJ9....
        // ============================================================
        String authHeader = request.getHeader("Authorization");

        // ============================================================
        // STEP 2: If Authorization header is missing
        // or does not start with "Bearer ",
        // skip JWT processing and continue request.
        // ============================================================
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ============================================================
        // STEP 3: Extract JWT token
        //
        // Example:
        // Header = "Bearer abc.def.xyz"
        // Token  = "abc.def.xyz"
        // ============================================================
        String token = authHeader.substring(7);

        // ============================================================
        // STEP 4: Validate token
        //
        // Checks:
        // - Token signature
        // - Expiration date
        // - Token structure
        // ============================================================
        if (jwtUtil.isValid(token)) {

            // ========================================================
            // STEP 5: Extract user email from JWT payload
            // ========================================================
            String email = jwtUtil.extractEmail(token);

            // ========================================================
            // STEP 6: Authenticate user only if:
            // 1. Email exists in token
            // 2. User is not already authenticated
            // ========================================================
            if (
                    email != null &&
                            SecurityContextHolder.getContext()
                                    .getAuthentication() == null
            ) {

                // ====================================================
                // STEP 7: Load user details from database
                // using email extracted from token.
                // ====================================================
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                // ====================================================
                // STEP 8: Create Authentication object
                //
                // Principal   -> UserDetails
                // Credentials -> null (password not needed)
                // Authorities -> Roles/Permissions
                // ====================================================
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // ====================================================
                // STEP 9: Attach request-specific details
                //
                // Includes:
                // - Remote IP Address
                // - Session ID (if available)
                // ====================================================
                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // ====================================================
                // STEP 10: Store authentication object in
                // Spring Security Context.
                //
                // After this step:
                // SecurityContextHolder.getContext()
                //         .getAuthentication()
                //
                // will return the authenticated user.
                // ====================================================
                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        }

        // ============================================================
        // STEP 11: Continue filter chain
        //
        // Request moves to next filter or controller.
        // ============================================================
        filterChain.doFilter(request, response);
    }
}