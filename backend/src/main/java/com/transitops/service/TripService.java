package com.transitops.service;

import com.transitops.model.*;
import com.transitops.repo.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TripService {
    private final TripRepository trips;
    private final VehicleRepository vehicles;
    private final DriverRepository drivers;

    public TripService(TripRepository trips, VehicleRepository vehicles, DriverRepository drivers) {
        this.trips = trips;
        this.vehicles = vehicles;
        this.drivers = drivers;
    }

    // Only Available vehicles can be dispatched (Retired / In Shop / On Trip are hidden)
    public List<Vehicle> selectableVehicles() {
        return vehicles.findByStatus(VehicleStatus.AVAILABLE);
    }

    // Only Available drivers with a valid (non-expired) license
    public List<Driver> selectableDrivers() {
        return drivers.findByStatus(DriverStatus.AVAILABLE).stream()
                .filter(d -> d.getLicenseExpiry() != null && d.getLicenseExpiry().isAfter(LocalDate.now()))
                .toList();
    }

    @Transactional
    public void dispatch(Long tripId) {
        Trip t = trips.findById(tripId).orElseThrow();
        Vehicle v = t.getVehicle();
        Driver d = t.getDriver();
        if (v.getStatus() != VehicleStatus.AVAILABLE) throw new IllegalStateException("Vehicle is not available");
        if (d.getStatus() != DriverStatus.AVAILABLE) throw new IllegalStateException("Driver is not available");
        if (d.getLicenseExpiry().isBefore(LocalDate.now()))
            throw new IllegalStateException("Driver license has expired");
        if (t.getCargoWeight() > v.getMaxLoad()) throw new IllegalStateException("Cargo exceeds vehicle capacity");
        v.setStatus(VehicleStatus.ON_TRIP);
        d.setStatus(DriverStatus.ON_TRIP);
        t.setStatus(TripStatus.DISPATCHED);
    }

    @Transactional
    public void complete(Long tripId, int finalOdometer, double fuelUsed) {
        Trip t = trips.findById(tripId).orElseThrow();
        t.setStatus(TripStatus.COMPLETED);
        t.setFinalOdometer(finalOdometer);
        t.setFuelUsed(fuelUsed);
        t.getVehicle().setStatus(VehicleStatus.AVAILABLE);
        t.getVehicle().setOdometer(finalOdometer);
        t.getDriver().setStatus(DriverStatus.AVAILABLE);
    }

    @Transactional
    public void cancel(Long tripId) {
        Trip t = trips.findById(tripId).orElseThrow();
        if (t.getStatus() == TripStatus.DISPATCHED) {
            t.getVehicle().setStatus(VehicleStatus.AVAILABLE);
            t.getDriver().setStatus(DriverStatus.AVAILABLE);
        }
        t.setStatus(TripStatus.CANCELLED);
    }
}
