import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/flight.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/booking';

  private bookingsSignal = signal<Booking[]>([]);
  public bookings = this.bookingsSignal.asReadonly();

  constructor() {
    this.loadBookings();
  }

  loadBookings() {
    this.getAllBookings().subscribe(data => {
      this.bookingsSignal.set(data);
    });
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/`, booking);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/`);
  }

  loadUserBookings(userId: number) {
    this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`).subscribe(data => {
      this.bookingsSignal.set(data);
    });
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  cancelBooking(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
