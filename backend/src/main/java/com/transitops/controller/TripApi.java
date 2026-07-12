package com.transitops.controller;

import com.transitops.model.*;
import com.transitops.repo.*;
import com.transitops.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
public class TripApi {
    private final TripRepository trips;
    private final VehicleRepository vehicles;
    private final DriverRepository drivers;
    private final TripService svc;

    public TripApi(TripRepository trips, VehicleRepository vehicles, DriverRepository drivers, TripService svc) {
        this.trips = trips;
        this.vehicles = vehicles;
        this.drivers = drivers;
        this.svc = svc;
    }

    public record TripReq(String source, String destination, Long vehicleId, Long driverId,
                          double cargoWeight, double plannedDistance) {
    }

    @GetMapping
    public List<Trip> all() {
        return trips.findAll();
    }

    @GetMapping("/options")
    public Map<String, Object> options() {
        return Map.of("vehicles", svc.selectableVehicles(), "drivers", svc.selectableDrivers());
    }

    @PostMapping
    public Trip create(@RequestBody TripReq r) {
        Vehicle v = vehicles.findById(r.vehicleId()).orElseThrow();
        if (r.cargoWeight() > v.getMaxLoad())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cargo exceeds vehicle capacity");
        Trip t = new Trip();
        t.setSource(r.source());
        t.setDestination(r.destination());
        t.setVehicle(v);
        t.setDriver(drivers.findById(r.driverId()).orElseThrow());
        t.setCargoWeight(r.cargoWeight());
        t.setPlannedDistance(r.plannedDistance());
        return trips.save(t);
    }

    @PostMapping("/{id}/dispatch")
    public void dispatch(@PathVariable Long id) {
        try {
            svc.dispatch(id);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/{id}/complete")
    public void complete(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        svc.complete(id, ((Number) body.get("finalOdometer")).intValue(), ((Number) body.get("fuelUsed")).doubleValue());
    }

    @PostMapping("/{id}/cancel")
    public void cancel(@PathVariable Long id) {
        svc.cancel(id);
    }
}
