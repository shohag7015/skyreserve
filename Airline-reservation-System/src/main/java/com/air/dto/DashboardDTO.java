package com.air.dto;

import com.air.entity.Booking;
import java.math.BigDecimal;
import java.util.List;

public class DashboardDTO {
    private BigDecimal totalRevenue;
    private long totalBookings;
    private long totalFlights;
    private long totalUsers;
    private long totalAirlines;
    private long totalAirports;
    private long totalCities;
    private long totalPassengers;
    private List<RecentBookingDTO> recentBookings;

    public DashboardDTO() {
    }

    public DashboardDTO(BigDecimal totalRevenue, long totalBookings, long totalFlights, long totalUsers,
            long totalAirlines, long totalAirports, long totalCities, long totalPassengers,
            List<RecentBookingDTO> recentBookings) {
        this.totalRevenue = totalRevenue;
        this.totalBookings = totalBookings;
        this.totalFlights = totalFlights;
        this.totalUsers = totalUsers;
        this.totalAirlines = totalAirlines;
        this.totalAirports = totalAirports;
        this.totalCities = totalCities;
        this.totalPassengers = totalPassengers;
        this.recentBookings = recentBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getTotalFlights() {
        return totalFlights;
    }

    public void setTotalFlights(long totalFlights) {
        this.totalFlights = totalFlights;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalAirlines() {
        return totalAirlines;
    }

    public void setTotalAirlines(long totalAirlines) {
        this.totalAirlines = totalAirlines;
    }

    public long getTotalAirports() {
        return totalAirports;
    }

    public void setTotalAirports(long totalAirports) {
        this.totalAirports = totalAirports;
    }

    public long getTotalCities() {
        return totalCities;
    }

    public void setTotalCities(long totalCities) {
        this.totalCities = totalCities;
    }

    public long getTotalPassengers() {
        return totalPassengers;
    }

    public void setTotalPassengers(long totalPassengers) {
        this.totalPassengers = totalPassengers;
    }

    public List<RecentBookingDTO> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<RecentBookingDTO> recentBookings) {
        this.recentBookings = recentBookings;
    }
}
