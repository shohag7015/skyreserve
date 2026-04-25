package com.air.repository;

import com.air.entity.Airline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirlineRepository extends JpaRepository<Airline,Long> {
    public Airline findAirlineBy(String iataCode);
}
