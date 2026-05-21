package com.emranhss.CourierManagement.repository;

import com.emranhss.CourierManagement.entity.Division;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DivisionRepository extends JpaRepository<Division, Integer> {

    // Find all divisions by country ID
    List<Division> findByCountryId(Integer countryId);

    // Find all divisions by country name
    List<Division> findByCountryName(String countryName);

}
