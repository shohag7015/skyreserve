import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../models/city.model';

@Injectable({
    providedIn: 'root'
})
export class CityService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/city';

    getAllCities(): Observable<City[]> {
        return this.http.get<City[]>(`${this.apiUrl}/`);
    }

    getCityById(id: number): Observable<City> {
        return this.http.get<City>(`${this.apiUrl}/${id}`);
    }

    createCity(city: City): Observable<City> {
        return this.http.post<City>(`${this.apiUrl}/`, city);
    }

    updateCity(id: number, city: City): Observable<City> {
        return this.http.put<City>(`${this.apiUrl}/${id}`, city);
    }

    deleteCity(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
