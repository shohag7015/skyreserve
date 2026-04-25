package com.air.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long ticketId;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;           // Foreign key to Booking entity

    @Column(name = "seat_id")
    private Long seatId;              // Foreign key to Seat entity (nullable if seat not yet assigned)

    @Column(name = "ticket_number", length = 15, nullable = false, unique = true)
    private String ticketNumber;      // e.g. "123-4567890123" or airline-specific format

    @Column(name = "passenger_name", length = 150, nullable = false)
    private String passengerName;     // Full name as printed on ticket (for e-ticket / manifest)

    @Column(name = "fare_paid", nullable = false, precision = 12, scale = 2)
    private BigDecimal farePaid;      // Actual amount paid for this ticket (may differ from base fare)

    @Column(name = "issued_at", nullable = false, updatable = false)
    private LocalDateTime issuedAt;   // When the ticket was issued / confirmed

    @Column(name = "ticket_status", length = 20, nullable = false)
    private String ticketStatus;      // e.g. "ISSUED", "ACTIVE", "USED", "CANCELLED", "REFUNDED", "VOID"

    @Column(name = "baggage_allowance", length = 50)
    private String baggageAllowance;  // e.g. "23kg + 7kg cabin", "2PC 23kg each", "NIL" (free baggage allowance)

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public BigDecimal getFarePaid() {
        return farePaid;
    }

    public void setFarePaid(BigDecimal farePaid) {
        this.farePaid = farePaid;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public String getTicketStatus() {
        return ticketStatus;
    }

    public void setTicketStatus(String ticketStatus) {
        this.ticketStatus = ticketStatus;
    }

    public String getBaggageAllowance() {
        return baggageAllowance;
    }

    public void setBaggageAllowance(String baggageAllowance) {
        this.baggageAllowance = baggageAllowance;
    }
}
