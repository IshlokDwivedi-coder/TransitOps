package com.transitops.config;

import com.transitops.model.*;
import com.transitops.repo.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {
    private final AppUserRepository users;
    private final VehicleRepository vehicles;
    private final DriverRepository drivers;

    public DataSeeder(AppUserRepository users, VehicleRepository vehicles, DriverRepository drivers) {
        this.users = users;
        this.vehicles = vehicles;
        this.drivers = drivers;
    }

    @Override
    public void run(String... args) {
        if (users.count() > 0) return;

        AppUser manager = new AppUser();
        manager.setEmail("manager@transitops.com");
        manager.setPassword("admin123"); // plain text, demo login only
        manager.setFullName("Fleet Manager");
        manager.setRole(Role.FLEET_MANAGER);
        users.save(manager);

        Vehicle van = new Vehicle();
        van.setRegNumber("VAN-05");
        van.setName("Tata Ace");
        van.setType("Van");
        van.setMaxLoad(500);
        van.setOdometer(12000);
        van.setAcquisitionCost(600000);
        vehicles.save(van);

        Driver alex = new Driver();
        alex.setName("Alex");
        alex.setLicenseNumber("DL-1234");
        alex.setLicenseCategory("LMV");
        alex.setLicenseExpiry(LocalDate.now().plusYears(2));
        alex.setContact("9999999999");
        alex.setSafetyScore(90);
        drivers.save(alex);
    }
}
