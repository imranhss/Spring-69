package com.emranhss.CourierManagement.serviceimp;

import com.emranhss.CourierManagement.entity.User;
import com.emranhss.CourierManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(username)
                .orElseThrow(()-> new UsernameNotFoundException(
                        "User not found with email: " + username
                ));
        // Role stored as "ADMIN" → Spring Security needs "ROLE_ADMIN"
        String roleAuthority = "ROLE_" + user.getRole().name();

        if (!user.isActive()) {
            throw new DisabledException(
                    "Your account is inactive. Please contact admin."
            );
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(roleAuthority))
        );

    }
}
