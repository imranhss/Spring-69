package com.emranhss.CourierManagement.repository;

import com.emranhss.CourierManagement.entity.Parcel;
import com.emranhss.CourierManagement.enums.ParcelStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long> {

    Optional<Parcel> findByTrackingCode(String trackingCode);

    boolean existsByTrackingCode(String trackingCode);

    @Query("""
        SELECT p FROM Parcel p
        LEFT JOIN FETCH p.customer c
        LEFT JOIN FETCH c.user
        LEFT JOIN FETCH p.rider r
        LEFT JOIN FETCH r.user
        LEFT JOIN FETCH p.originPoliceStation ops
        LEFT JOIN FETCH ops.district opsd
        LEFT JOIN FETCH opsd.division
        LEFT JOIN FETCH p.destinationPoliceStation dps
        LEFT JOIN FETCH dps.district dpsd
        LEFT JOIN FETCH dpsd.division
        LEFT JOIN FETCH p.history
        WHERE p.customer.id = :customerId
        ORDER BY p.createdAt DESC
    """)
    List<Parcel> findByCustomerIdWithDetails(@Param("customerId") Long customerId);

    @Query("""
        SELECT p FROM Parcel p
        LEFT JOIN FETCH p.customer c
        LEFT JOIN FETCH c.user
        LEFT JOIN FETCH p.rider r
        LEFT JOIN FETCH r.user
        LEFT JOIN FETCH p.originPoliceStation
        LEFT JOIN FETCH p.destinationPoliceStation
        LEFT JOIN FETCH p.history
        WHERE p.rider.id = :riderId
        ORDER BY p.createdAt DESC
    """)
    List<Parcel> findByRiderIdWithDetails(@Param("riderId") Long riderId);

    @Query("""
        SELECT p FROM Parcel p
        LEFT JOIN FETCH p.customer c
        LEFT JOIN FETCH c.user
        LEFT JOIN FETCH p.rider r
        LEFT JOIN FETCH r.user
        LEFT JOIN FETCH p.originPoliceStation ops
        LEFT JOIN FETCH ops.district opsd
        LEFT JOIN FETCH opsd.division
        LEFT JOIN FETCH p.destinationPoliceStation dps
        LEFT JOIN FETCH dps.district dpsd
        LEFT JOIN FETCH dpsd.division
        LEFT JOIN FETCH p.history
        WHERE p.trackingCode = :code
    """)
    Optional<Parcel> findByTrackingCodeWithDetails(@Param("code") String code);

    @Query("""
        SELECT p FROM Parcel p
        LEFT JOIN FETCH p.customer c
        LEFT JOIN FETCH c.user
        LEFT JOIN FETCH p.rider r
        LEFT JOIN FETCH r.user
        LEFT JOIN FETCH p.originPoliceStation ops
        LEFT JOIN FETCH ops.district opsd
        LEFT JOIN FETCH opsd.division
        LEFT JOIN FETCH p.destinationPoliceStation dps
        LEFT JOIN FETCH dps.district dpsd
        LEFT JOIN FETCH dpsd.division
        LEFT JOIN FETCH p.history
        WHERE p.id = :id
    """)
    Optional<Parcel> findByIdWithDetails(@Param("id") Long id);

    List<Parcel> findByStatusAndRiderIsNull(ParcelStatus status);
    List<Parcel> findByStatus(ParcelStatus status);


    @Query("""
        SELECT DISTINCT p FROM Parcel p
        LEFT JOIN FETCH p.customer c
        LEFT JOIN FETCH c.user
        LEFT JOIN FETCH p.bookedByAgent a
        LEFT JOIN FETCH a.user
        LEFT JOIN FETCH a.hub
        LEFT JOIN FETCH p.rider r
        LEFT JOIN FETCH r.user
        LEFT JOIN FETCH p.originPoliceStation ops
        LEFT JOIN FETCH ops.district opsd
        LEFT JOIN FETCH opsd.division
        LEFT JOIN FETCH p.destinationPoliceStation dps
        LEFT JOIN FETCH dps.district dpsd
        LEFT JOIN FETCH dpsd.division
        LEFT JOIN FETCH p.history
        WHERE p.originPoliceStation.id = :hubId
           OR p.destinationPoliceStation.id = :hubId
               OR p.currentHub.id = :hubId
        ORDER BY p.createdAt DESC
    """)
    List<Parcel> findByHubWithDetails(@Param("hubId") Long hubId);

    // ── Hub parcels filtered by status ────────────────────────────
    @Query("""
        SELECT DISTINCT p FROM Parcel p
        LEFT JOIN FETCH p.customer c
        LEFT JOIN FETCH c.user
        LEFT JOIN FETCH p.bookedByAgent a
        LEFT JOIN FETCH a.user
        LEFT JOIN FETCH a.hub
        LEFT JOIN FETCH p.rider r
        LEFT JOIN FETCH r.user
        LEFT JOIN FETCH p.originPoliceStation ops
        LEFT JOIN FETCH ops.district
        LEFT JOIN FETCH p.destinationPoliceStation dps
        LEFT JOIN FETCH dps.district
        LEFT JOIN FETCH p.history
        WHERE (p.originPoliceStation.id = :hubId
           OR  p.destinationPoliceStation.id = :hubId)
          AND p.status = :status
        ORDER BY p.createdAt DESC
    """)
    List<Parcel> findByHubAndStatusWithDetails(
            @Param("hubId") Long hubId,
            @Param("status") ParcelStatus status);


}
