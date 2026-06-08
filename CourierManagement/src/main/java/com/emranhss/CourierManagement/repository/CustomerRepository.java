package com.emranhss.CourierManagement.repository;

import com.emranhss.CourierManagement.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    @Query("""
        SELECT c FROM Customer c
        LEFT JOIN FETCH c.user
        LEFT JOIN FETCH c.policeStation ps
        LEFT JOIN FETCH ps.district d
        LEFT JOIN FETCH d.division
        WHERE c.id = :id
    """)
    Optional<Customer> findByIdWithDetails(@Param("id") Long id);

    @Query("""
        SELECT c FROM Customer c
        LEFT JOIN FETCH c.user
        LEFT JOIN FETCH c.policeStation ps
        LEFT JOIN FETCH ps.district d
        LEFT JOIN FETCH d.division
    """)
    List<Customer> findAllWithDetails();

}
