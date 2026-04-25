package com.air.service;

import com.air.entity.Passenger;
import java.util.List;

public interface PassengerService {
    List<Passenger> getAllPassengers();

    Passenger getPassengerById(Long id);

    Passenger getPassengerByUserId(Long userId);

    Passenger createPassenger(Passenger passenger);

    Passenger updatePassenger(Long id, Passenger passenger);

    void deletePassenger(Long id);
}
