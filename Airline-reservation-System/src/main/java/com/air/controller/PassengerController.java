package com.air.controller;

import com.air.entity.Passenger;
import com.air.service.PassengerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/passenger")
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @GetMapping("/")
    public List<Passenger> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

    @GetMapping("/{id}")
    public Passenger getPassengerById(@PathVariable("id") Long id) {
        return passengerService.getPassengerById(id);
    }

    @GetMapping("/user/{userId}")
    public Passenger getPassengerByUserId(@PathVariable("userId") Long userId) {
        return passengerService.getPassengerByUserId(userId);
    }

    @PostMapping("/")
    public Passenger createPassenger(@RequestBody Passenger passenger) {
        return passengerService.createPassenger(passenger);
    }

    @PutMapping("/{id}")
    public Passenger updatePassenger(@PathVariable("id") Long id, @RequestBody Passenger passenger) {
        return passengerService.updatePassenger(id, passenger);
    }

    @DeleteMapping("/{id}")
    public void deletePassenger(@PathVariable("id") Long id) {
        passengerService.deletePassenger(id);
    }
}
