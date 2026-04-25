package com.air.service;

import com.air.entity.Airport;
import java.util.List;

public interface AirportService {
    List<Airport> getAllAirports();
    Airport getAirportById(Long id);
    Airport createAirport(Airport airport);
    Airport updateAirport(Long id, Airport airport);
    void deleteAirport(Long id);
}
