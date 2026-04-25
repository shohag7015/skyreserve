import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightApiService } from '../../../core/services/flight-api.service';
import { AirlineService } from '../../../core/services/airline.service';
import { AirportService } from '../../../core/services/airport.service';
import { Flight } from '../../../core/models/flight.model';
import { Airline } from '../../../core/models/airline.model';
import { Airport } from '../../../core/models/airport.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-flight-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="admin-container animate-fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Flight Management</h1>
          <p>Schedule and optimize flight routes.</p>
        </div>
      <button
  class="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
  (click)="showForm.set(true)"
>
  <lucide-icon name="plus" class="w-5 h-5"></lucide-icon>
  Schedule New Flight
</button>
      </header>

      <div class="glass-card" *ngIf="showForm()">
        <form (ngSubmit)="saveFlight()" #flightForm="ngForm" class="airline-form">
          <h3>{{ editingId ? 'Edit' : 'Schedule' }} Flight</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Flight Number</label>
              <input [(ngModel)]="currentFlight.flightNumber" name="flightNumber" #flightNumber="ngModel" placeholder="e.g. EK202" required>
              <div *ngIf="flightForm.submitted && flightNumber.errors?.['required']" class="error-text">Required</div>
            </div>
            <div class="form-group">
              <label>Airline</label>
              <select [(ngModel)]="currentFlight.airlineId" name="airlineId" #airlineIdSelect="ngModel" required>
                <option [value]="0" disabled>Select Airline</option>
                <option *ngFor="let airline of airlines()" [value]="airline.airlineId">{{ airline.airlineName }}</option>
              </select>
              <div *ngIf="flightForm.submitted && currentFlight.airlineId === 0" class="error-text">Required</div>
            </div>
            <div class="form-group">
              <label>Origin Airport</label>
              <select [(ngModel)]="currentFlight.originAirportId" name="originAirportId" required>
                <option [value]="0" disabled>Select Airport</option>
                <option *ngFor="let airport of airports()" [value]="airport.airportId">{{ airport.airportName }} ({{ airport.iataCode }})</option>
              </select>
            </div>
            <div class="form-group">
              <label>Destination Airport</label>
              <select [(ngModel)]="currentFlight.destAirportId" name="destAirportId" required>
                <option [value]="0" disabled>Select Airport</option>
                <option *ngFor="let airport of airports()" [value]="airport.airportId">{{ airport.airportName }} ({{ airport.iataCode }})</option>
              </select>
            </div>
            <div class="form-group">
              <label>Departure Time</label>
              <input type="datetime-local" [(ngModel)]="currentFlight.departureTime" name="departureTime" required>
            </div>
            <div class="form-group">
              <label>Arrival Time</label>
              <input type="datetime-local" [(ngModel)]="currentFlight.arrivalTime" name="arrivalTime" required>
            </div>
            <div class="form-group">
              <label>Economy Fare</label>
              <input type="number" [(ngModel)]="currentFlight.economyFare" name="economyFare" required>
            </div>
            <div class="form-group">
              <label>Business Fare</label>
              <input type="number" [(ngModel)]="currentFlight.businessFare" name="businessFare" required>
            </div>
            <div class="form-group">
              <label>Available Seats</label>
              <input type="number" [(ngModel)]="currentFlight.availableSeats" name="availableSeats" required>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="currentFlight.status" name="status" required>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="ON_TIME">ON_TIME</option>
                <option value="DELAYED">DELAYED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
             <div class="form-group">
              <label>Duration (Min)</label>
              <input type="number" [(ngModel)]="currentFlight.durationMin" name="durationMin" required>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="cancelEdit()">Cancel</button>
            <button type="submit" class="btn-primary">
              {{ editingId ? 'Update' : 'Save' }} Flight
            </button>
          </div>
        </form>
      </div>

      <div class="table-container glass-card mt-6">
        <table class="premium-table">
          <thead>
            <tr>
              <th>Flight #</th>
              <th>Route</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Eco/Bus Fare</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let flight of flights()" class="table-row">
              <td><strong>{{ flight.flightNumber }}</strong></td>
              <td>
                <span class="route-badge">{{ getAirportCode(flight.originAirportId) }}</span>
                <lucide-icon name="arrow-right" class="mx-2 w-4 h-4"></lucide-icon>
                <span class="route-badge">{{ getAirportCode(flight.destAirportId) }}</span>
              </td>
              <td>{{ flight.departureTime | date:'short' }}</td>
              <td>{{ flight.arrivalTime | date:'short' }}</td>
              <td>
                <div class="flex flex-col">
                  <span class="text-xs text-slate-400">E: \${{ flight.economyFare || flight.baseFare }}</span>
                  <span class="text-xs text-slate-400">B: \${{ flight.businessFare || '-' }}</span>
                </div>
              </td>
              <td><span class="status-badge" [class]="flight.status.toLowerCase()">{{ flight.status }}</span></td>
              <td class="actions">
                <button class="icon-btn edit" (click)="editFlight(flight)" title="Edit">
                  <lucide-icon name="edit-2"></lucide-icon>
                </button>
                <button class="icon-btn delete" (click)="deleteFlight(flight.flightId!)" title="Delete">
                  <lucide-icon name="trash-2"></lucide-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
    .header-content h1 { font-size: 2.5rem; margin: 0; color: #1a1a1a; }
    .header-content p { color: #666; margin: 0.5rem 0 0; }
    .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 1.5rem; padding: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; }
    .form-group input, .form-group select { width: 100%; padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 0.8rem; background: rgba(255,255,255,0.9); }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .premium-table { width: 100%; border-collapse: collapse; text-align: left; }
    .premium-table th { padding: 1.2rem 1rem; border-bottom: 2px solid #eee; color: #777; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
    .premium-table td { padding: 1.2rem 1rem; border-bottom: 1px solid #eee; }
    .table-row { transition: background 0.3s ease; }
    .table-row:hover { background: rgba(0,0,0,0.02); }
    .route-badge { background: #f0f0f0; padding: 0.2rem 0.5rem; border-radius: 0.4rem; font-family: monospace; font-weight: 600; }
    .status-badge { padding: 0.2rem 0.6rem; border-radius: 2rem; font-weight: 600; font-size: 0.75rem; }
    .status-badge.scheduled { background: #E3F2FD; color: #1976D2; }
    .status-badge.on_time { background: #E8F5E9; color: #2E7D32; }
    .status-badge.delayed { background: #FFF3E0; color: #EF6C00; }
    .status-badge.cancelled { background: #FFEBEE; color: #C62828; }
    .mx-2 { margin: 0 0.5rem; }
    .actions { display: flex; gap: 0.5rem; }
    .icon-btn { border: none; background: none; padding: 0.5rem; cursor: pointer; border-radius: 0.5rem; transition: all 0.2s; }
    .icon-btn.edit { color: #2196F3; }
    .icon-btn.delete { color: #F44336; }
    .btn-primary { background: #000; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: all 0.3s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .mt-6 { margin-top: 1.5rem; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .error-text { color: #f44336; font-size: 0.75rem; margin-top: 0.25rem; font-weight: 500; }
  `]
})
export class FlightManagementComponent implements OnInit {
  flights = signal<Flight[]>([]);
  airlines = signal<Airline[]>([]);
  airports = signal<Airport[]>([]);
  showForm = signal(false);
  currentFlight: Flight = this.resetFlight();
  editingId: number | null = null;

  constructor(
    private flightService: FlightApiService,
    private airlineService: AirlineService,
    private airportService: AirportService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.flightService.getAllFlights().subscribe(data => this.flights.set(data));
    this.airlineService.getAllAirlines().subscribe(data => this.airlines.set(data));
    this.airportService.getAllAirports().subscribe(data => this.airports.set(data));
  }

  resetFlight(): Flight {
    return {
      airlineId: 0,
      originAirportId: 0,
      destAirportId: 0,
      flightNumber: '',
      departureTime: '',
      arrivalTime: '',
      durationMin: 0,
      status: 'SCHEDULED',
      baseFare: 0,
      availableSeats: 0
    };
  }

  getAirportCode(id: number): string {
    const airport = this.airports().find(a => a.airportId === id);
    return airport ? airport.iataCode : '???';
  }

  saveFlight() {
    if (!this.currentFlight.flightNumber || !this.currentFlight.airlineId) return;

    if (this.editingId) {
      this.flightService.updateFlight(this.editingId, this.currentFlight).subscribe({
        next: () => {
          this.loadData();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating flight:', err)
      });
    } else {
      this.flightService.createFlight(this.currentFlight).subscribe({
        next: () => {
          this.loadData();
          this.currentFlight = this.resetFlight();
          this.showForm.set(false);
        },
        error: (err) => console.error('Error creating flight:', err)
      });
    }
  }

  editFlight(flight: Flight) {
    this.editingId = flight.flightId!;
    this.currentFlight = { ...flight };
    this.showForm.set(true);
  }

  cancelEdit() {
    this.editingId = null;
    this.currentFlight = this.resetFlight();
    this.showForm.set(false);
  }

  deleteFlight(id: number) {
    if (confirm('Are you sure you want to delete this flight?')) {
      this.flightService.deleteFlight(id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
