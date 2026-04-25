import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Flight } from '../models/flight.model';
import { AirlineService } from './airline.service';
import { Airline } from '../models/airline.model';
import { CityService } from './city.service';
import { City } from '../models/city.model';
import { AirportService } from './airport.service';
import { Airport } from '../models/airport.model';
import { FlightApiService } from './flight-api.service';
import { TravelerData } from '../../shared/components/traveler-picker/traveler-picker.component';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private http = inject(HttpClient);
  private airlineService = inject(AirlineService);
  private cityService = inject(CityService);
  private airportService = inject(AirportService);
  private flightApiService = inject(FlightApiService);
  private apiUrl = 'http://localhost:8080/flight';

  private flightsSignal = signal<Flight[]>([]);
  public flights = this.flightsSignal.asReadonly();
  public availableAirlines = signal<Airline[]>([]);
  public availableCities = signal<City[]>([]);
  public availableAirports = signal<Airport[]>([]);

  constructor() {
    this.loadFlights();
    this.loadAirlines();
    this.loadCities();
    this.loadAirports();
  }

  loadFlights() {
    this.http.get<Flight[]>(`${this.apiUrl}/`).subscribe(data => {
      const enriched = data.map(f => this.enrichFlight(f));
      this.flightsSignal.set(enriched);
    });
  }

  private enrichFlight(f: Flight): Flight {
    const airlines = this.availableAirlines();
    const airports = this.availableAirports();
    const cities = this.availableCities();

    // If lookup data isn't loaded yet, return original
    if (airlines.length === 0 || airports.length === 0) return f;

    const airline = airlines.find(a => a.airlineId === f.airlineId);
    const origin = airports.find(a => a.airportId === f.originAirportId);
    const dest = airports.find(a => a.airportId === f.destAirportId);
    const fromCity = cities.find(c => c.cityId === origin?.cityId);
    const toCity = cities.find(c => c.cityId === dest?.cityId);

    return {
      ...f,
      airlineName: airline?.airlineName,
      airlineCode: airline?.iataCode,
      fromCode: origin?.iataCode,
      toCode: dest?.iataCode,
      fromCity: fromCity?.cityName,
      toCity: toCity?.cityName
    };
  }

  loadAirlines() {
    this.airlineService.getAllAirlines().subscribe(data => {
      this.availableAirlines.set(data);
    });
  }

  loadCities() {
    this.cityService.getAllCities().subscribe(data => {
      this.availableCities.set(data);
    });
  }

  loadAirports() {
    this.airportService.getAllAirports().subscribe(data => {
      this.availableAirports.set(data);
    });
  }

  searchCriteria = signal<{
    type: 'one-way' | 'round-trip' | 'multi-city';
    segments: Array<{ fromCityId?: number; toCityId?: number; date: string }>;
    travelers: TravelerData;
    returnDate?: string;
  }>({
    type: 'one-way',
    segments: [{ date: '' }],
    travelers: { adults: 1, children: 0, infants: 0, travelClass: 'Economy' }
  });

  filters = signal<{
    maxPrice: number;
    airlines: number[];
    stops: number[];
  }>({
    maxPrice: 3000,
    airlines: [],
    stops: [0, 1, 2]
  });

  filteredFlights = computed(() => {
    const criteria = this.searchCriteria();
    const filter = this.filters();
    const airports = this.availableAirports();

    return this.flightsSignal().filter(f => {
      // General filters
      const matchesPrice = f.baseFare <= filter.maxPrice;
      const matchesAirline = filter.airlines.length === 0 || filter.airlines.includes(f.airlineId);

      // City matching based on the first segment (for simplicity in this example)
      let matchesOriginCity = true;
      let matchesDestCity = true;
      let matchesDate = true;

      const firstSegment = criteria.segments[0];
      if (firstSegment) {
        if (firstSegment.fromCityId) {
          const originAirport = airports.find(a => a.airportId === f.originAirportId);
          matchesOriginCity = originAirport?.cityId === firstSegment.fromCityId;
        }
        if (firstSegment.toCityId) {
          const destAirport = airports.find(a => a.airportId === f.destAirportId);
          matchesDestCity = destAirport?.cityId === firstSegment.toCityId;
        }
        if (firstSegment.date && f.departureTime) {
          const flightDate = f.departureTime.split('T')[0];
          matchesDate = flightDate === firstSegment.date;
        }
      }

      return matchesPrice && matchesAirline && matchesOriginCity && matchesDestCity && matchesDate;
    });
  });

  updateSearch(type: 'one-way' | 'round-trip' | 'multi-city', segments: any[], travelers: TravelerData, returnDate?: string) {
    this.searchCriteria.set({ type, segments, travelers, returnDate });
    // If we have full search criteria, fetch from the backend search endpoint
    const first = segments[0];
    if (first?.fromCityId && first?.toCityId && first?.date) {
      this.flightApiService.searchFlights(first.fromCityId, first.toCityId, first.date)
        .subscribe(data => {
          const enriched = data.map(f => this.enrichFlight(f));
          this.flightsSignal.set(enriched);
        });
    } else {
      // No specific city/date — reload all flights
      this.loadFlights();
    }
  }

  updatePriceFilter(maxPrice: number) {
    this.filters.update(f => ({ ...f, maxPrice }));
  }

  toggleAirlineFilter(airlineId: number) {
    this.filters.update(f => {
      const airlines = f.airlines.includes(airlineId)
        ? f.airlines.filter(id => id !== airlineId)
        : [...f.airlines, airlineId];
      return { ...f, airlines };
    });
  }

  getCityNameById(cityId: number | undefined): string {
    if (!cityId) return 'Anywhere';
    const city = this.availableCities().find(c => c.cityId === cityId);
    return city ? city.cityName : 'Unknown City';
  }

  getFlightById(id: number) {
    const flight = this.flightsSignal().find(f => f.flightId === id);
    if (!flight) return undefined;

    // Re-enrich in case lookups were loaded after initial flight load
    return this.enrichFlight(flight);
  }

  getTotalTravelers(): number {
    const t = this.searchCriteria().travelers;
    return t.adults + t.children + t.infants;
  }

  calculateTotalPrice(flight: Flight): number {
    const t = this.searchCriteria().travelers;
    const baseFare = t.travelClass === 'Business'
      ? (flight.businessFare || flight.baseFare * 1.5)
      : (flight.economyFare || flight.baseFare);

    const adultCost = baseFare * t.adults;
    const childCost = (baseFare * 0.75) * t.children;
    const infantCost = (baseFare * 0.5) * t.infants;

    return adultCost + childCost + infantCost;
  }
}
