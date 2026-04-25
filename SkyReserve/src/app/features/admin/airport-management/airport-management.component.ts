import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AirportService } from '../../../core/services/airport.service';
import { Airport } from '../../../core/models/airport.model';
import { CityService } from '../../../core/services/city.service';
import { City } from '../../../core/models/city.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-airport-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="admin-container animate-fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Airport Management</h1>
          <p>Configure airport hubs and connection points.</p>
        </div>
       <button
  class="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
  (click)="showForm.set(true)"
>
  <lucide-icon name="plus" class="w-5 h-5 group-hover:rotate-90 transition"></lucide-icon>
  Add New Airport
</button>
      </header>

      <div class="glass-card" *ngIf="showForm()">
        <form (ngSubmit)="saveAirport()" #airportForm="ngForm" class="airline-form">
          <h3>{{ editingId ? 'Edit' : 'Add' }} Airport</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Airport Name</label>
              <input [(ngModel)]="currentAirport.airportName" name="airportName" #airportName="ngModel" placeholder="e.g. Heathrow Airport" required>
              <div *ngIf="airportForm.submitted && airportName.errors?.['required']" class="error-text">Required</div>
            </div>
            <div class="form-group">
              <label>IATA Code</label>
              <input [(ngModel)]="currentAirport.iataCode" name="iataCode" #iataCode="ngModel" placeholder="e.g. LHR" required>
              <div *ngIf="airportForm.submitted && iataCode.errors?.['required']" class="error-text">Required</div>
            </div>
            <div class="form-group">
              <label>Country</label>
              <input [(ngModel)]="currentAirport.country" name="country" #country="ngModel" placeholder="e.g. United Kingdom" required>
              <div *ngIf="airportForm.submitted && country.errors?.['required']" class="error-text">Required</div>
            </div>
            <div class="form-group">
              <label>City</label>
              <select [(ngModel)]="currentAirport.cityId" name="cityId" #cityId="ngModel" required>
                <option [ngValue]="undefined" disabled>Select City</option>
                <option *ngFor="let city of cities()" [ngValue]="city.cityId">{{ city.cityName }}, {{ city.country }}</option>
              </select>
              <div *ngIf="airportForm.submitted && cityId.errors?.['required']" class="error-text">Required</div>
            </div>
            <div class="form-group">
              <label>Timezone</label>
              <input [(ngModel)]="currentAirport.timezone" name="timezone" #timezone="ngModel" placeholder="e.g. GMT+1" required>
              <div *ngIf="airportForm.submitted && timezone.errors?.['required']" class="error-text">Required</div>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="cancelEdit()">Cancel</button>
            <button type="submit" class="btn-primary">
               {{ editingId ? 'Update' : 'Save' }} Airport
            </button>
          </div>
        </form>
      </div>

      <div class="table-container glass-card mt-6">
        <table class="premium-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Airport Name</th>
              <th>IATA</th>
              <th>Country</th>
              <th>Timezone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let airport of airports()" class="table-row">
              <td>#{{ airport.airportId }}</td>
              <td><strong>{{ airport.airportName }}</strong></td>
              <td><span class="badge">{{ airport.iataCode }}</span></td>
              <td>{{ airport.country }}</td>
              <td>{{ airport.timezone }}</td>
              <td class="actions">
                <button class="icon-btn edit" (click)="editAirport(airport)" title="Edit">
                  <lucide-icon name="edit-2"></lucide-icon>
                </button>
                <button class="icon-btn delete" (click)="deleteAirport(airport.airportId!)" title="Delete">
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
    /* Same styles as Airline management for consistency */
    .admin-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
    .header-content h1 { font-size: 2.5rem; margin: 0; color: #1a1a1a; }
    .header-content p { color: #666; margin: 0.5rem 0 0; }
    .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 1.5rem; padding: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; }
    .form-group input, .form-group select { width: 100%; padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 0.8rem; background: rgba(255,255,255,0.9); }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .premium-table { width: 100%; border-collapse: collapse; text-align: left; }
    .premium-table th { padding: 1.2rem 1rem; border-bottom: 2px solid #eee; color: #777; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
    .premium-table td { padding: 1.2rem 1rem; border-bottom: 1px solid #eee; }
    .table-row { transition: background 0.3s ease; }
    .table-row:hover { background: rgba(0,0,0,0.02); }
    .badge { background: #E3F2FD; color: #1976D2; padding: 0.2rem 0.6rem; border-radius: 2rem; font-weight: 600; font-size: 0.8rem; }
    .actions { display: flex; gap: 0.5rem; }
    .icon-btn { border: none; background: none; padding: 0.5rem; cursor: pointer; border-radius: 0.5rem; transition: all 0.2s; }
    .icon-btn.edit { color: #2196F3; }
    .icon-btn.delete { color: #F44336; }
    .btn-primary { background: #000; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: all 0.3s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .mt-6 { margin-top: 1.5rem; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .error-text { color: #F44336; font-size: 0.75rem; margin-top: 0.25rem; font-weight: 500; }
  `]
})
export class AirportManagementComponent implements OnInit {
  airports = signal<Airport[]>([]);
  cities = signal<City[]>([]);
  showForm = signal(false);
  currentAirport: Airport = this.resetAirport();
  editingId: number | null = null;

  constructor(private airportService: AirportService, private cityService: CityService) { }

  ngOnInit() {
    this.loadAirports();
    this.loadCities();
  }

  loadAirports() {
    this.airportService.getAllAirports().subscribe(data => {
      this.airports.set(data);
    });
  }

  loadCities() {
    this.cityService.getAllCities().subscribe(data => {
      this.cities.set(data);
    });
  }

  resetAirport(): Airport {
    return {
      airportName: '',
      iataCode: '',
      country: '',
      cityId: undefined,
      timezone: ''
    };
  }

  saveAirport() {
    if (this.editingId) {
      this.airportService.updateAirport(this.editingId, this.currentAirport).subscribe(() => {
        this.loadAirports();
        this.cancelEdit();
      });
    } else {
      this.airportService.createAirport(this.currentAirport).subscribe(() => {
        this.loadAirports();
        this.currentAirport = this.resetAirport();
        this.showForm.set(false);
      });
    }
  }

  editAirport(airport: Airport) {
    this.editingId = airport.airportId!;
    this.currentAirport = { ...airport };
    this.showForm.set(true);
  }

  cancelEdit() {
    this.editingId = null;
    this.currentAirport = this.resetAirport();
    this.showForm.set(false);
  }

  deleteAirport(id: number) {
    if (confirm('Are you sure you want to delete this airport?')) {
      this.airportService.deleteAirport(id).subscribe(() => {
        this.loadAirports();
      });
    }
  }
}
