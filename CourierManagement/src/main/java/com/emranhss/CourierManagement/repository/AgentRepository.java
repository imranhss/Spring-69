package com.emranhss.CourierManagement.repository;

import com.emranhss.CourierManagement.entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {

    // Single agent with full hub chain
    @Query("""
        SELECT a FROM Agent a
        LEFT JOIN FETCH a.user
        LEFT JOIN FETCH a.hub h
        LEFT JOIN FETCH h.district d
        LEFT JOIN FETCH d.division dv
        LEFT JOIN FETCH dv.country
        WHERE a.id = :id
    """)
    Optional<Agent> findByIdWithDetails(@Param("id") Long id);

    // All agents with full hub chain
    @Query("""
        SELECT a FROM Agent a
        LEFT JOIN FETCH a.user
        LEFT JOIN FETCH a.hub h
        LEFT JOIN FETCH h.district d
        LEFT JOIN FETCH d.division dv
        LEFT JOIN FETCH dv.country
    """)
    List<Agent> findAllWithDetails();

    // All agents at a specific hub
    @Query("""
        SELECT a FROM Agent a
        LEFT JOIN FETCH a.user
        LEFT JOIN FETCH a.hub h
        LEFT JOIN FETCH h.district d
        LEFT JOIN FETCH d.division dv
        LEFT JOIN FETCH dv.country
        WHERE a.hub.id = :hubId
    """)
    List<Agent> findByHubId(@Param("hubId") Long hubId);

    // Active agents at a hub
    List<Agent> findByHubIdAndActiveTrue(Long hubId);

    boolean existsByUserId(Long userId);

}
