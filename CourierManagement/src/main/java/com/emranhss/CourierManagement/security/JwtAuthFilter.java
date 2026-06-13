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

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil                  jwtUtil;
    private final CustomUserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        // 1. Read Authorization header
        String authHeader = request.getHeader("Authorization");

        // 2. Skip if no Bearer token present
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract token
        String token = authHeader.substring(7);


        // 4. Validate and set authentication
        if(jwtUtil.isValid(token)){
            String email = jwtUtil.extractEmail(token);

            // Only set auth if not already authenticated
            if(
                    email != null &&
                            SecurityContextHolder.getContext().getAuthentication() == null){

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);

            }


        }

        filterChain.doFilter(request, response);
    }
}
