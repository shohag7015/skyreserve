package com.air.service.impl;

import com.air.entity.Payment;
import com.air.repository.PaymentRepository;
import com.air.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private com.air.repository.BookingRepository bookingRepository;

    @Override
    public Payment processPayment(Payment payment) {
        payment.setPaymentDate(LocalDateTime.now());
        // For simulation, we'll set a random transaction ID if not provided
        if (payment.getTransactionId() == null || payment.getTransactionId().isEmpty()) {
            payment.setTransactionId(UUID.randomUUID().toString());
        }
        // Simplified logic: assume payment is successful for now
        payment.setPaymentStatus("SUCCESS");

        Payment savedPayment = paymentRepository.save(payment);

        // Update booking status
        bookingRepository.findById(payment.getBookingId()).ifPresent(booking -> {
            booking.setBookingStatus("CONFIRMED");
            bookingRepository.save(booking);
        });

        return savedPayment;
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    @Override
    public List<Payment> getPaymentsByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}
