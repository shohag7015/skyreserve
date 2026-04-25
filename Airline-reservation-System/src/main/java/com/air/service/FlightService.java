package com.air.service;

import com.air.entity.Flight;

import java.time.LocalDate;
import java.util.List;

public interface FlightService {

    List<Flight> getAllFlights();

    Flight getFlightById(Long id);

    Flight createFlight(Flight flight);

    Flight updateFlight(Long id, Flight flight);

    void deleteFlight(Long id);

    List<Flight> searchFlights(Long fromCityId, Long toCityId, LocalDate departureDate);
}

