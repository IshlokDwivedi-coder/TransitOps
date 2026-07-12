package com.transitops.repo;

import com.transitops.model.Driver;
import com.transitops.model.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByStatus(DriverStatus status);

    long countByStatus(DriverStatus status);
}
