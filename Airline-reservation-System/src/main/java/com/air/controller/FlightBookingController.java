package com.air.controller;

import com.air.entity.Booking;
import com.air.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/booking")
public class FlightBookingController {

    private final BookingService bookingService;

    public FlightBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/")
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(@PathVariable("userId") Long userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable("id") Long id) {
        return bookingService.getBookingById(id);
    }

    @PostMapping("/{id}/cancel")
    public void cancelBooking(@PathVariable("id") Long id) {
        bookingService.cancelBooking(id);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable("id") Long id) {
        bookingService.deleteBooking(id);
    }
}
