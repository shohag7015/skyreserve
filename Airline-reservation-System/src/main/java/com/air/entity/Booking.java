package com.air.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "passenger_id")
    private Long passengerId; // Kept to satisfy existing legacy NOT NULL postgres constraint without dropping
                              // db.

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "booking_passengers", joinColumns = @JoinColumn(name = "booking_id"), inverseJoinColumns = @JoinColumn(name = "passenger_id"))
    private List<Passenger> passengers;

    @Column(name = "flight_id", nullable = false)
    private Long flightId; // Foreign key to Flight entity

    @Column(name = "user_id", nullable = false)
    private Long userId; // Link booking to the user who made it

    @Column(name = "booking_date", nullable = false, updatable = false)
    private LocalDateTime bookingDate; // When the booking was made

    @Column(name = "booking_status", length = 20, nullable = false)
    private String bookingStatus; // e.g. "CONFIRMED", "PENDING", "CANCELLED", "REFUNDED"

    @Column(name = "total_fare", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalFare; // Total amount paid (base + taxes + fees)

    @Column(name = "pnr_number", length = 10, nullable = false, unique = true)
    private String pnrNumber; // 6- alphanumeric record locator (e.g. "ABC123")

    @Column(name = "class_type", length = 20, nullable = false)
    private String classType; // Cabin class: "ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"

    @Column(name = "no_of_passengers", nullable = false)
    private Integer noOfPassengers; // Number of passengers in this booking (usually 1–many)

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public List<Passenger> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<Passenger> passengers) {
        this.passengers = passengers;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public BigDecimal getTotalFare() {
        return totalFare;
    }

    public void setTotalFare(BigDecimal totalFare) {
        this.totalFare = totalFare;
    }

    public String getPnrNumber() {
        return pnrNumber;
    }

    public void setPnrNumber(String pnrNumber) {
        this.pnrNumber = pnrNumber;
    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    public Integer getNoOfPassengers() {
        return noOfPassengers;
    }

    public void setNoOfPassengers(Integer noOfPassengers) {
        this.noOfPassengers = noOfPassengers;
    }
}
