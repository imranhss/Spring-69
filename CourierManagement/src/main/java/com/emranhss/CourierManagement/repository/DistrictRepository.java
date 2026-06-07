package com.emranhss.CourierManagement.repository;

import com.emranhss.CourierManagement.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
        List<District> findByDivisionId(Long divisionId);

        List<District> findByDivisionName(String divisionName);

}
