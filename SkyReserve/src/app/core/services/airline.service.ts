import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airline } from '../models/airline.model';

@Injectable({
    providedIn: 'root'
})
export class AirlineService {
    private apiUrl = 'http://localhost:8080/airline';

    constructor(private http: HttpClient) { }

    getAllAirlines(): Observable<Airline[]> {
        return this.http.get<Airline[]>(`${this.apiUrl}/`);
    }

    getAirlineById(id: number): Observable<Airline> {
        return this.http.get<Airline>(`${this.apiUrl}/${id}`);
    }

    createAirline(airline: Airline): Observable<Airline> {
        return this.http.post<Airline>(`${this.apiUrl}/`, airline);
    }

    updateAirline(id: number, airline: Airline): Observable<Airline> {
        return this.http.put<Airline>(`${this.apiUrl}/${id}`, airline);
    }

    deleteAirline(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
