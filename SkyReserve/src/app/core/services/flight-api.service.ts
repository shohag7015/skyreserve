import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from '../models/flight.model';

@Injectable({
    providedIn: 'root'
})
export class FlightApiService {
    private apiUrl = 'http://localhost:8080/flight';

    constructor(private http: HttpClient) { }

    getAllFlights(): Observable<Flight[]> {
        return this.http.get<Flight[]>(`${this.apiUrl}/`);
    }

    searchFlights(fromCityId: number, toCityId: number, date: string): Observable<Flight[]> {
        return this.http.get<Flight[]>(`${this.apiUrl}/search`, {
            params: { fromCityId: fromCityId.toString(), toCityId: toCityId.toString(), date }
        });
    }

    getFlightById(id: number): Observable<Flight> {
        return this.http.get<Flight>(`${this.apiUrl}/${id}`);
    }

    createFlight(flight: Flight): Observable<Flight> {
        return this.http.post<Flight>(`${this.apiUrl}/`, flight);
    }

    updateFlight(id: number, flight: Flight): Observable<Flight> {
        return this.http.put<Flight>(`${this.apiUrl}/${id}`, flight);
    }

    deleteFlight(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
