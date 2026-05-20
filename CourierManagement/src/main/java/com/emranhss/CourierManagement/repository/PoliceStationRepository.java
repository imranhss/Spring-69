package com.emranhss.CourierManagement.repository;

import com.emranhss.CourierManagement.entity.PoliceStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PoliceStationRepository extends JpaRepository<PoliceStation, Long> {
}
