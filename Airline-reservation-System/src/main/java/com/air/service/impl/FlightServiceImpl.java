package com.air.service.impl;

import com.air.entity.Flight;
import com.air.repository.FlightRepository;
import com.air.service.FlightService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;

    public FlightServiceImpl(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    @Override
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    @Override
    public Flight getFlightById(Long id) {
        return flightRepository.findById(id).orElseThrow(() -> new RuntimeException("Flight not found"));
    }

    @Override
    public Flight createFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    @Override
    public Flight updateFlight(Long id, Flight flight) {
        Flight existing = getFlightById(id);
        existing.setAirlineId(flight.getAirlineId());
        existing.setOriginAirportId(flight.getOriginAirportId());
        existing.setDestAirportId(flight.getDestAirportId());
        existing.setFlightNumber(flight.getFlightNumber());
        existing.setDepartureTime(flight.getDepartureTime());
        existing.setArrivalTime(flight.getArrivalTime());
        existing.setDurationMin(flight.getDurationMin());
        existing.setStatus(flight.getStatus());
        existing.setBaseFare(flight.getBaseFare());
        existing.setEconomyFare(flight.getEconomyFare());
        existing.setBusinessFare(flight.getBusinessFare());
        existing.setAvailableSeats(flight.getAvailableSeats());
        return flightRepository.save(existing);
    }

    @Override
    public void deleteFlight(Long id) {
        flightRepository.deleteById(id);
    }

    @Override
    public List<Flight> searchFlights(Long fromCityId, Long toCityId, LocalDate departureDate) {
        return flightRepository.searchFlights(fromCityId, toCityId, departureDate);
    }
}

