package com.air.repository;

import com.air.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    java.util.Optional<Passenger> findFirstByUserIdOrderByPassengerIdDesc(Long userId);
}
