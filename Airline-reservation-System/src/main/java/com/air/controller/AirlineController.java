package com.air.controller;

import com.air.entity.Airline;
import com.air.service.AirlineService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/airline")
public class AirlineController {

    private final AirlineService airlineService;

    public AirlineController(AirlineService airlineService) {
        this.airlineService = airlineService;
    }

    @GetMapping("/")
    public List<Airline> getAllAirline() {
        return airlineService.getAllAirlines();
    }

    @GetMapping("/{id}")
    public Airline getAirlineById(@PathVariable("id") Long id) {
        return airlineService.getAirlineById(id);
    }

    @PostMapping("/")
    public Airline createAirline(@RequestBody Airline airline) {
        return airlineService.createAirline(airline);
    }

    @PutMapping("/{id}")
    public Airline updateAirline(@PathVariable("id") Long id, @RequestBody Airline airline) {
        return airlineService.updateAirline(id, airline);
    }

    @DeleteMapping("/{id}")
    public void deleteAirline(@PathVariable("id") Long id) {
        airlineService.deleteAirline(id);
    }
}
