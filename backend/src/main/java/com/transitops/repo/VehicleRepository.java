package com.transitops.repo;

import com.transitops.model.Vehicle;
import com.transitops.model.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByStatus(VehicleStatus status);

    long countByStatus(VehicleStatus status);

    boolean existsByRegNumberIgnoreCase(String regNumber);
}
