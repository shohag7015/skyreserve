package com.air.service.impl;

import com.air.entity.Airline;
import com.air.repository.AirlineRepository;
import com.air.service.AirlineService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirlineServiceImpl implements AirlineService {

    private final AirlineRepository airlineRepository;

    public AirlineServiceImpl(AirlineRepository airlineRepository) {
        this.airlineRepository = airlineRepository;
    }

    @Override
    public List<Airline> getAllAirlines() {
        return airlineRepository.findAll();
    }

    @Override
    public Airline getAirlineById(Long id) {
        return airlineRepository.findById(id).orElseThrow(() -> new RuntimeException("Airline not found"));
    }

    @Override
    public Airline createAirline(Airline airline) {
        return airlineRepository.save(airline);
    }

    @Override
    public Airline updateAirline(Long id, Airline airline) {
        Airline existing = getAirlineById(id);
        existing.setAirlineName(airline.getAirlineName());
        existing.setIataCode(airline.getIataCode());
        existing.setCountry(airline.getCountry());
        existing.setCity(airline.getCity());
        existing.setContactEmail(airline.getContactEmail());
        existing.setEstablishedYr(airline.getEstablishedYr());
        return airlineRepository.save(existing);
    }

    @Override
    public void deleteAirline(Long id) {
        airlineRepository.deleteById(id);
    }
}
