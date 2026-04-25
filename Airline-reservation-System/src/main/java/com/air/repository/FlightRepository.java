package com.air.repository;

import com.air.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    @Query("SELECT f FROM Flight f " +
            "JOIN Airport originAp ON originAp.airportId = f.originAirportId " +
            "JOIN Airport destAp ON destAp.airportId = f.destAirportId " +
            "WHERE originAp.cityId = :fromCityId " +
            "AND destAp.cityId = :toCityId " +
            "AND FUNCTION('DATE', f.departureTime) = :departureDate")
    List<Flight> searchFlights(@Param("fromCityId") Long fromCityId,
            @Param("toCityId") Long toCityId,
            @Param("departureDate") LocalDate departureDate);
}
