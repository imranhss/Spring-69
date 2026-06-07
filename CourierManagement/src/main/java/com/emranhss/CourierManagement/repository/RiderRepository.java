package com.emranhss.CourierManagement.repository;

import com.emranhss.CourierManagement.entity.Rider;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiderRepository extends JpaRepository<Rider, Long> {



    @Query("""
        SELECT DISTINCT r FROM Rider r
        LEFT JOIN FETCH r.zones z
        LEFT JOIN FETCH z.district d
        LEFT JOIN FETCH d.division
        LEFT JOIN FETCH r.user
    """)
    List<Rider> findAllRiders();

    @Query("""
        SELECT r FROM Rider r
        LEFT JOIN FETCH r.zones z
        LEFT JOIN FETCH z.district d
        LEFT JOIN FETCH d.division
        LEFT JOIN FETCH r.user
        WHERE r.id = :id
    """)
    Optional<Rider> findByIdWithZones(@Param("id") Long id);

}
