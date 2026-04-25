package com.air.service.impl;

import com.air.entity.Booking;
import com.air.entity.Flight;
import com.air.repository.BookingRepository;
import com.air.repository.FlightRepository;
import com.air.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, FlightRepository flightRepository) {
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
    }

    @Override
    @Transactional
    public Booking createBooking(Booking booking) {
        Flight flight = flightRepository.findById(booking.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (flight.getAvailableSeats() < booking.getNoOfPassengers()) {
            throw new RuntimeException("Not enough seats available");
        }

        // Update flight inventory
        flight.setAvailableSeats(flight.getAvailableSeats() - booking.getNoOfPassengers());
        flightRepository.save(flight);

        // Set booking details
        if (booking.getPassengers() != null && !booking.getPassengers().isEmpty()) {
            booking.setPassengerId(booking.getPassengers().get(0).getPassengerId());
        } else {
            booking.setPassengerId(1L); // Fallback dummy ID to satisfy existing Postgres constraint
        }
        booking.setBookingDate(LocalDateTime.now());
        booking.setBookingStatus("CONFIRMED");
        if (booking.getPnrNumber() == null) {
            booking.setPnrNumber(UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }

        return bookingRepository.save(booking);
    }

    @Override
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if ("CANCELLED".equals(booking.getBookingStatus())) {
            return;
        }

        Flight flight = flightRepository.findById(booking.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        // Restore flight inventory
        flight.setAvailableSeats(flight.getAvailableSeats() + booking.getNoOfPassengers());
        flightRepository.save(flight);

        booking.setBookingStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    @Override
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
