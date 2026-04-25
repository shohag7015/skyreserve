import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = 'http://localhost:8080/payment';

    constructor(private http: HttpClient) { }

    processPayment(payment: Payment): Observable<Payment> {
        return this.http.post<Payment>(`${this.apiUrl}/`, payment);
    }

    getPaymentById(id: number): Observable<Payment> {
        return this.http.get<Payment>(`${this.apiUrl}/${id}`);
    }

    getPaymentsByBookingId(bookingId: number): Observable<Payment[]> {
        return this.http.get<Payment[]>(`${this.apiUrl}/booking/${bookingId}`);
    }
}
