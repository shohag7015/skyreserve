package com.air.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_id")
    private Long flightId;

    @Column(name = "airline_id", nullable = false)
    private Long airlineId; // Foreign key to Airline entity

    @Column(name = "origin_airport_id", nullable = false)
    private Long originAirportId; // Foreign key to Airport entity

    @Column(name = "dest_airport_id", nullable = false)
    private Long destAirportId; // Foreign key to Airport entity

    @Column(name = "flight_number", nullable = false)
    private String flightNumber; // e.g. "BG305", "QR1234"

    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;

    @Column(name = "duration_min", nullable = false)
    private Integer durationMin; // Duration in minutes (e.g. 180 for 3 hours)

    @Column(name = "status", length = 20, nullable = false)
    private String status; // e.g. "SCHEDULED", "ON_TIME", "DELAYED", "CANCELLED", "BOARDING"

    @Column(name = "base_fare", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseFare; // Use BigDecimal for money values

    @Column(name = "economy_fare", precision = 10, scale = 2)
    private BigDecimal economyFare; // Economy class fare

    @Column(name = "business_fare", precision = 10, scale = 2)
    private BigDecimal businessFare; // Business class fare

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public Long getAirlineId() {
        return airlineId;
    }

    public void setAirlineId(Long airlineId) {
        this.airlineId = airlineId;
    }

    public Long getOriginAirportId() {
        return originAirportId;
    }

    public void setOriginAirportId(Long originAirportId) {
        this.originAirportId = originAirportId;
    }

    public Long getDestAirportId() {
        return destAirportId;
    }

    public void setDestAirportId(Long destAirportId) {
        this.destAirportId = destAirportId;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Integer getDurationMin() {
        return durationMin;
    }

    public void setDurationMin(Integer durationMin) {
        this.durationMin = durationMin;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getBaseFare() {
        return baseFare;
    }

    public void setBaseFare(BigDecimal baseFare) {
        this.baseFare = baseFare;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public BigDecimal getEconomyFare() {
        return economyFare;
    }

    public void setEconomyFare(BigDecimal economyFare) {
        this.economyFare = economyFare;
    }

    public BigDecimal getBusinessFare() {
        return businessFare;
    }

    public void setBusinessFare(BigDecimal businessFare) {
        this.businessFare = businessFare;
    }
}
