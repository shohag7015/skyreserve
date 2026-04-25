package com.air.repository;

import com.air.dto.RecentBookingDTO;
import com.air.entity.Booking;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    java.util.List<Booking> findByUserId(Long userId);

//    @org.springframework.data.jpa.repository.Query("SELECT SUM(b.totalFare) FROM Booking b WHERE b.bookingStatus = :status")
//    java.math.BigDecimal sumTotalFareByStatus(String status);

    java.util.List<Booking> findTop5ByOrderByBookingDateDesc();

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByPassengers_PassengerId(Long passengerId);

    @Query("SELECT SUM(b.totalFare) FROM Booking b WHERE b.bookingStatus = :status")
    BigDecimal sumTotalFareByStatus(String status);

    @Query("""
        SELECT new com.air.dto.RecentBookingDTO(
            b.bookingId,
            b.pnrNumber,
            b.bookingStatus,
            b.totalFare,
            b.bookingDate
        )
        FROM Booking b
        ORDER BY b.bookingDate DESC
    """)
    List<RecentBookingDTO> findRecentBookings(Pageable pageable);
}
