package com.emranhss.CourierManagement.repository;

import com.emranhss.CourierManagement.entity.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long> {

}
