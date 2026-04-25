package com.air.service;

import com.air.entity.Airline;
import java.util.List;

public interface AirlineService {
    List<Airline> getAllAirlines();
    Airline getAirlineById(Long id);
    Airline createAirline(Airline airline);
    Airline updateAirline(Long id, Airline airline);
    void deleteAirline(Long id);
}
