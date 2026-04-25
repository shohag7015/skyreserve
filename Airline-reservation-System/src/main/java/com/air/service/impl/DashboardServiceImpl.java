package com.air.service.impl;

import com.air.dto.DashboardDTO;
import com.air.dto.RecentBookingDTO;
import com.air.repository.AirlineRepository;
import com.air.repository.AirportRepository;
import com.air.repository.BookingRepository;
import com.air.repository.CityRepository;
import com.air.repository.FlightRepository;
import com.air.repository.PassengerRepository;
import com.air.repository.UserRepository;
import com.air.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Override
    public DashboardDTO getDashboardStats() {
        BigDecimal revenue = bookingRepository.sumTotalFareByStatus("CONFIRMED");
        if (revenue == null) {
            revenue = BigDecimal.ZERO;
        }

        List<RecentBookingDTO> recentBookings =
                bookingRepository.findRecentBookings(PageRequest.of(0, 5));

        return new DashboardDTO(
                revenue,
                bookingRepository.count(),
                flightRepository.count(),
                userRepository.count(),
                airlineRepository.count(),
                airportRepository.count(),
                cityRepository.count(),
                passengerRepository.count(),
                recentBookings
        );
    }
}