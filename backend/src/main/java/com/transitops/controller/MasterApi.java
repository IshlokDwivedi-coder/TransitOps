package com.transitops.controller;

import com.transitops.model.*;
import com.transitops.repo.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MasterApi {
    private final VehicleRepository vehicles;
    private final DriverRepository drivers;
    private final TripRepository trips;
    private final AppUserRepository users;

    public MasterApi(VehicleRepository vehicles, DriverRepository drivers, TripRepository trips, AppUserRepository users) {
        this.vehicles = vehicles;
        this.drivers = drivers;
        this.trips = trips;
        this.users = users;
    }

    @GetMapping("/vehicles")
    public List<Vehicle> vehicles() {
        return vehicles.findAll();
    }

    @PostMapping("/vehicles")
    public Vehicle addVehicle(@RequestBody Vehicle v) {
        if (vehicles.existsByRegNumberIgnoreCase(v.getRegNumber()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration number already exists");
        v.setStatus(VehicleStatus.AVAILABLE);
        return vehicles.save(v);
    }

    @GetMapping("/drivers")
    public List<Driver> drivers() {
        return drivers.findAll();
    }

    @PostMapping("/drivers")
    public Driver addDriver(@RequestBody Driver d) {
        d.setStatus(DriverStatus.AVAILABLE);
        return drivers.save(d);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        AppUser u = users.findByEmail(body.get("email"))
                .filter(x -> x.getPassword().equals(body.get("password")))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        return Map.of("email", u.getEmail(), "name", u.getFullName(), "role", u.getRole());
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        long total = vehicles.count();
        long onTrip = vehicles.countByStatus(VehicleStatus.ON_TRIP);
        return Map.of(
                "available", vehicles.countByStatus(VehicleStatus.AVAILABLE),
                "onTrip", onTrip,
                "inShop", vehicles.countByStatus(VehicleStatus.IN_SHOP),
                "activeTrips", trips.countByStatus(TripStatus.DISPATCHED),
                "pendingTrips", trips.countByStatus(TripStatus.DRAFT),
                "utilization", total == 0 ? 0 : Math.round(onTrip * 100.0 / total));
    }
}
