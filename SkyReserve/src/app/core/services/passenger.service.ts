import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Passenger } from '../models/passenger.model';

@Injectable({
    providedIn: 'root'
})
export class PassengerService {
    private apiUrl = 'http://localhost:8080/passenger';

    constructor(private http: HttpClient) { }

    getAllPassengers(): Observable<Passenger[]> {
        return this.http.get<Passenger[]>(`${this.apiUrl}/`);
    }

    getPassengerById(id: number): Observable<Passenger> {
        return this.http.get<Passenger>(`${this.apiUrl}/${id}`);
    }

    getPassengerByUserId(userId: number): Observable<Passenger> {
        return this.http.get<Passenger>(`${this.apiUrl}/user/${userId}`);
    }

    createPassenger(passenger: Passenger): Observable<Passenger> {
        return this.http.post<Passenger>(`${this.apiUrl}/`, passenger);
    }

    updatePassenger(id: number, passenger: Passenger): Observable<Passenger> {
        return this.http.put<Passenger>(`${this.apiUrl}/${id}`, passenger);
    }

    deletePassenger(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
