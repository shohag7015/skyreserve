package com.air.controller;

import com.air.entity.Flight;
import com.air.service.FlightService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/flight")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping("/")
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/search")
    public List<Flight> searchFlights(
            @RequestParam("fromCityId") Long fromCityId,
            @RequestParam("toCityId") Long toCityId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return flightService.searchFlights(fromCityId, toCityId, date);
    }

    @GetMapping("/{id}")
    public Flight getFlightById(@PathVariable("id") Long id) {
        return flightService.getFlightById(id);
    }

    @PostMapping("/")
    public Flight createFlight(@RequestBody Flight flight) {
        return flightService.createFlight(flight);
    }

    @PutMapping("/{id}")
    public Flight updateFlight(@PathVariable("id") Long id, @RequestBody Flight flight) {
        return flightService.updateFlight(id, flight);
    }

    @DeleteMapping("/{id}")
    public void deleteFlight(@PathVariable("id") Long id) {
        flightService.deleteFlight(id);
    }
}

