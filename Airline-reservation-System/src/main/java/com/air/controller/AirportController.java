package com.air.controller;

import com.air.entity.Airport;
import com.air.service.AirportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/airport")
public class AirportController {

    private final AirportService airportService;

    public AirportController(AirportService airportService) {
        this.airportService = airportService;
    }

    @GetMapping("/")
    public List<Airport> getAllAirports() {
        return airportService.getAllAirports();
    }

    @GetMapping("/{id}")
    public Airport getAirportById(@PathVariable("id") Long id) {
        return airportService.getAirportById(id);
    }

    @PostMapping("/")
    public Airport createAirport(@RequestBody Airport airport) {
        return airportService.createAirport(airport);
    }

    @PutMapping("/{id}")
    public Airport updateAirport(@PathVariable("id") Long id, @RequestBody Airport airport) {
        return airportService.updateAirport(id, airport);
    }

    @DeleteMapping("/{id}")
    public void deleteAirport(@PathVariable("id") Long id) {
        airportService.deleteAirport(id);
    }
}
