package com.air.service;

import com.air.entity.Booking;
import java.util.List;

public interface BookingService {
    Booking createBooking(Booking booking);

    Booking getBookingById(Long id);

    List<Booking> getAllBookings();

    List<Booking> getBookingsByUserId(Long userId);

    void cancelBooking(Long id);

    void deleteBooking(Long id);
}
