package com.transitops.repo;

import com.transitops.model.Trip;
import com.transitops.model.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {
    long countByStatus(TripStatus status);
}
