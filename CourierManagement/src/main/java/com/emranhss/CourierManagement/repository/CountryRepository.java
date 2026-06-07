package com.emranhss.CourierManagement.repository;

import com.emranhss.CourierManagement.entity.Country;
import com.emranhss.CourierManagement.entity.Division;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {



}
