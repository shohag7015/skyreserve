package com.air.controller;

import com.air.entity.Payment;
import com.air.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/")
    public Payment processPayment(@RequestBody Payment payment) {
        return paymentService.processPayment(payment);
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable("id") Long id) {
        return paymentService.getPaymentById(id);
    }

    @GetMapping("/booking/{bookingId}")
    public List<Payment> getPaymentsByBookingId(@PathVariable("bookingId") Long bookingId) {
        return paymentService.getPaymentsByBookingId(bookingId);
    }
}
