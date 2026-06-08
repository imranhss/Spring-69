package com.emranhss.CourierManagement.util.parcel;

import com.emranhss.CourierManagement.enums.ServiceType;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
public class TrackingCodeGenerator {

    public String generateTrackingCode() {

        return "TRN-" +System.currentTimeMillis() ;
    }


    public double calculateCharge(double weight, ServiceType serviceType,double codAmount) {

        double base = 0;
        double perKg = 0;

        switch (serviceType) {
            case STANDARD -> {
                base = 60;
                perKg = 20;
            }
            case EXPRESS -> {
                base = 100;
                perKg = 35;
            }
            case OVERNIGHT -> {
                base = 180;
                perKg = 50;
            }
            case SAME_DAY -> {
                base = 250;
                perKg = 60;
            }
        }

        double charge = base + (weight * perKg);

        if (codAmount > 0) {
            charge += codAmount * 0.015;
        }

        return charge;
    }


}
