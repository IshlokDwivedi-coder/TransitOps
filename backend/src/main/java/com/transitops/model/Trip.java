package com.transitops.model;

import jakarta.persistence.*;

@Entity
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String source;
    private String destination;
    @ManyToOne
    private Vehicle vehicle;
    @ManyToOne
    private Driver driver;
    private double cargoWeight;
    private double plannedDistance;
    private Integer finalOdometer;
    private Double fuelUsed;
    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.DRAFT;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public double getCargoWeight() {
        return cargoWeight;
    }

    public void setCargoWeight(double cargoWeight) {
        this.cargoWeight = cargoWeight;
    }

    public double getPlannedDistance() {
        return plannedDistance;
    }

    public void setPlannedDistance(double plannedDistance) {
        this.plannedDistance = plannedDistance;
    }

    public Integer getFinalOdometer() {
        return finalOdometer;
    }

    public void setFinalOdometer(Integer finalOdometer) {
        this.finalOdometer = finalOdometer;
    }

    public Double getFuelUsed() {
        return fuelUsed;
    }

    public void setFuelUsed(Double fuelUsed) {
        this.fuelUsed = fuelUsed;
    }

    public TripStatus getStatus() {
        return status;
    }

    public void setStatus(TripStatus status) {
        this.status = status;
    }
}
