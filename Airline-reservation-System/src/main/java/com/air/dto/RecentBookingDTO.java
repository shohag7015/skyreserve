package com.air.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RecentBookingDTO {
    private Long bookingId;
    private String pnrNumber;
    private String bookingStatus;
    private BigDecimal totalFare;
    private LocalDateTime bookingDate;

    public RecentBookingDTO(Long bookingId, String pnrNumber, String bookingStatus,
                            BigDecimal totalFare, LocalDateTime bookingDate) {
        this.bookingId = bookingId;
        this.pnrNumber = pnrNumber;
        this.bookingStatus = bookingStatus;
        this.totalFare = totalFare;
        this.bookingDate = bookingDate;
    }

    public Long getBookingId() { return bookingId; }
    public String getPnrNumber() { return pnrNumber; }
    public String getBookingStatus() { return bookingStatus; }
    public BigDecimal getTotalFare() { return totalFare; }
    public LocalDateTime getBookingDate() { return bookingDate; }
}