package com.air.service;

import com.air.entity.Payment;
import java.util.List;

public interface PaymentService {
    Payment processPayment(Payment payment);

    Payment getPaymentById(Long id);

    List<Payment> getPaymentsByBookingId(Long bookingId);
}
