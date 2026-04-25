package com.air.service.impl;

import com.air.entity.Passenger;
import com.air.repository.BookingRepository;
import com.air.repository.PassengerRepository;
import com.air.service.PassengerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class PassengerServiceImpl implements PassengerService {

    private final PassengerRepository passengerRepository;
    private final BookingRepository bookingRepository;

    public PassengerServiceImpl(PassengerRepository passengerRepository, BookingRepository bookingRepository) {
        this.passengerRepository = passengerRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    @Override
    public Passenger getPassengerById(Long id) {
        return passengerRepository.findById(id).orElseThrow(() -> new RuntimeException("Passenger not found"));
    }

    @Override
    public Passenger getPassengerByUserId(Long userId) {
        return passengerRepository.findFirstByUserIdOrderByPassengerIdDesc(userId).orElse(null);
    }

    @Override
    public Passenger createPassenger(Passenger passenger) {
        passenger.setCreatedAt(LocalDateTime.now());
        return passengerRepository.save(passenger);
    }

    @Override
    public Passenger updatePassenger(Long id, Passenger passenger) {
        Passenger existing = getPassengerById(id);
        existing.setFirstName(passenger.getFirstName());
        existing.setLastName(passenger.getLastName());
        existing.setEmail(passenger.getEmail());
        existing.setPhone(passenger.getPhone());
        existing.setPassportNo(passenger.getPassportNo());
        existing.setNationality(passenger.getNationality());
        existing.setDateOfBirth(passenger.getDateOfBirth());
        return passengerRepository.save(existing);
    }

    @Override
    @Transactional
    public void deletePassenger(Long id) {
        // Cascade delete bookings first
        bookingRepository.deleteByPassengers_PassengerId(id);
        // Then delete the passenger
        passengerRepository.deleteById(id);
    }
}
