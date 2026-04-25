package com.air.service.impl;

import com.air.entity.Airport;
import com.air.repository.AirportRepository;
import com.air.service.AirportService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirportServiceImpl implements AirportService {

    private final AirportRepository airportRepository;

    public AirportServiceImpl(AirportRepository airportRepository) {
        this.airportRepository = airportRepository;
    }

    @Override
    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }

    @Override
    public Airport getAirportById(Long id) {
        return airportRepository.findById(id).orElseThrow(() -> new RuntimeException("Airport not found"));
    }

    @Override
    public Airport createAirport(Airport airport) {
        return airportRepository.save(airport);
    }

    @Override
    public Airport updateAirport(Long id, Airport airport) {
        Airport existing = getAirportById(id);
        existing.setAirportName(airport.getAirportName());
        existing.setIataCode(airport.getIataCode());
        existing.setCountry(airport.getCountry());
        existing.setCityId(airport.getCityId());
        existing.setTimezone(airport.getTimezone());
        return airportRepository.save(existing);
    }

    @Override
    public void deleteAirport(Long id) {
        airportRepository.deleteById(id);
    }
}
