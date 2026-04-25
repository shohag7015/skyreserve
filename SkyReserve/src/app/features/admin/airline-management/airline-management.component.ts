import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AirlineService } from '../../../core/services/airline.service';
import { Airline } from '../../../core/models/airline.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-airline-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="admin-container animate-fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Airline Management</h1>
          <p>Maintain and update the list of partner airlines.</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95" 
        (click)="showForm.set(true)">
          <lucide-icon name="plus" class="w-5 h-5 group-hover:rotate-90 transition"></lucide-icon>
          Add New Airline
        </button>
      </header>

      <div class="glass-card" *ngIf="showForm()">
        <form (ngSubmit)="saveAirline()" #airlineForm="ngForm" class="airline-form">
          <h3>{{ editingId ? 'Edit' : 'Add' }} Airline</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Airline Name</label>
              <input [(ngModel)]="currentAirline.airlineName" name="airlineName" #airlineName="ngModel" placeholder="e.g. Emirates" required>
              <div *ngIf="airlineForm.submitted && airlineName.errors?.['required']" class="error-text">Required</div>
            </div>
            <div class="form-group">
              <label>IATA Code</label>
              <input [(ngModel)]="currentAirline.iataCode" name="iataCode" #iataCode="ngModel" placeholder="e.g. EK" required>
              <div *ngIf="airlineForm.submitted && iataCode.errors?.['required']" class="error-text">Required</div>
            </div>
            <div class="form-group">
              <label>Country</label>
              <input [(ngModel)]="currentAirline.country" name="country" #country="ngModel" placeholder="e.g. UAE" required>
              <div *ngIf="airlineForm.submitted && country.errors?.['required']" class="error-text">Required</div>
            </div>
            <div class="form-group">
              <label>Contact Email</label>
              <input [(ngModel)]="currentAirline.contactEmail" name="contactEmail" #email="ngModel" type="email" placeholder="contact@airline.com" required email>
              <div *ngIf="airlineForm.submitted && email.errors?.['required']" class="error-text">Required</div>
              <div *ngIf="airlineForm.submitted && email.errors?.['email']" class="error-text">Invalid email</div>
            </div>
            <div class="form-group">
              <label>Established Year</label>
              <input [(ngModel)]="currentAirline.establishedYr" name="establishedYr" placeholder="e.g. 1985">
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="cancelEdit()">Cancel</button>
            <button type="submit" class="btn-primary">
              {{ editingId ? 'Update' : 'Save' }} Airline
            </button>
          </div>
        </form>
      </div>

      <div class="table-container glass-card mt-6">
        <table class="premium-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Airline Name</th>
              <th>IATA</th>
              <th>Country</th>
              <th>Email</th>
              <th>Established</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let airline of airlines()" class="table-row">
              <td>#{{ airline.airlineId }}</td>
              <td><strong>{{ airline.airlineName }}</strong></td>
              <td><span class="badge">{{ airline.iataCode }}</span></td>
              <td>{{ airline.country }}</td>
              <td>{{ airline.contactEmail }}</td>
              <td>{{ airline.establishedYr }}</td>
              <td class="actions">
                <button class="icon-btn edit" (click)="editAirline(airline)" title="Edit">
                  <lucide-icon name="edit-2"></lucide-icon>
                </button>
                <button class="icon-btn delete" (click)="deleteAirline(airline.airlineId!)" title="Delete">
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
    .admin-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;
    }
    .header-content h1 {
      font-size: 2.5rem;
      margin: 0;
      color: var(--primary);
    }
    .header-content p {
      color: #666;
      margin: 0.5rem 0 0;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      font-size: 0.9rem;
    }
    .form-group input {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #ddd;
      border-radius: 0.8rem;
      background: rgba(255,255,255,0.9);
      transition: all 0.3s ease;
    }
    .form-group input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
    .premium-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .premium-table th {
      padding: 1.2rem 1rem;
      border-bottom: 2px solid #eee;
      color: #777;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }
    .premium-table td {
      padding: 1.2rem 1rem;
      border-bottom: 1px solid #eee;
    }
    .table-row {
      transition: background 0.3s ease;
    }
    .table-row:hover {
      background: rgba(var(--primary-rgb), 0.02);
    }
    .badge {
      background: var(--primary-light);
      color: var(--primary);
      padding: 0.2rem 0.6rem;
      border-radius: 2rem;
      font-weight: 600;
      font-size: 0.8rem;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .icon-btn {
      border: none;
      background: none;
      padding: 0.5rem;
      cursor: pointer;
      border-radius: 0.5rem;
      transition: all 0.2s;
    }
    .icon-btn:hover {
      background: #eee;
    }
    .icon-btn.edit { color: #2196F3; }
    .icon-btn.delete { color: #F44336; }
    .btn-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
    }
    .mt-6 { margin-top: 1.5rem; }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .error-text {
      color: #F44336;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      font-weight: 500;
    }
  `]
})
export class AirlineManagementComponent implements OnInit {
  airlines = signal<Airline[]>([]);
  showForm = signal(false);
  currentAirline: Airline = this.resetAirline();
  editingId: number | null = null;

  constructor(private airlineService: AirlineService) { }

  ngOnInit() {
    this.loadAirlines();
  }

  loadAirlines() {
    this.airlineService.getAllAirlines().subscribe(data => {
      this.airlines.set(data);
    });
  }

  resetAirline(): Airline {
    return {
      airlineName: '',
      iataCode: '',
      country: '',
      contactEmail: '',
      establishedYr: ''
    };
  }

  saveAirline() {
    if (!this.currentAirline.airlineName || !this.currentAirline.iataCode || !this.currentAirline.contactEmail) {
      return;
    }

    if (this.editingId) {
      this.airlineService.updateAirline(this.editingId, this.currentAirline).subscribe({
        next: () => {
          this.loadAirlines();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating airline:', err)
      });
    } else {
      this.airlineService.createAirline(this.currentAirline).subscribe({
        next: () => {
          this.loadAirlines();
          this.currentAirline = this.resetAirline();
          this.showForm.set(false);
        },
        error: (err) => console.error('Error creating airline:', err)
      });
    }
  }

  editAirline(airline: Airline) {
    this.editingId = airline.airlineId!;
    this.currentAirline = { ...airline };
    this.showForm.set(true);
  }

  cancelEdit() {
    this.editingId = null;
    this.currentAirline = this.resetAirline();
    this.showForm.set(false);
  }

  deleteAirline(id: number) {
    if (confirm('Are you sure you want to delete this airline?')) {
      this.airlineService.deleteAirline(id).subscribe(() => {
        this.loadAirlines();
      });
    }
  }
}
