import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PassengerService } from '../../../core/services/passenger.service';
import { Passenger } from '../../../core/models/passenger.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-passenger-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="admin-container animate-fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Passenger Management</h1>
          <p>Manage passenger profiles and travel documentation.</p>
        </div>
        <button class="btn-primary" (click)="showForm.set(true)">
          <i-lucide name="plus"></i-lucide>
          Add New Passenger
        </button>
      </header>

      <div class="glass-card" *ngIf="showForm()">
        <form (submit)="savePassenger()" class="airline-form">
          <h3>{{ editingId ? 'Edit' : 'Add' }} Passenger</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>First Name</label>
              <input [(ngModel)]="currentPassenger.firstName" name="firstName" placeholder="John" required>
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input [(ngModel)]="currentPassenger.lastName" name="lastName" placeholder="Doe" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="currentPassenger.email" name="email" placeholder="john@example.com" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input [(ngModel)]="currentPassenger.phone" name="phone" placeholder="+1234567890" required>
            </div>
            <div class="form-group">
              <label>Passport No</label>
              <input [(ngModel)]="currentPassenger.passportNo" name="passportNo" placeholder="E1234567" required>
            </div>
            <div class="form-group">
              <label>Nationality</label>
              <input [(ngModel)]="currentPassenger.nationality" name="nationality" placeholder="United States" required>
            </div>
            <div class="form-group">
              <label>Date of Birth</label>
              <input type="date" [(ngModel)]="currentPassenger.dateOfBirth" name="dateOfBirth" required>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="cancelEdit()">Cancel</button>
            <button type="submit" class="btn-primary">Save Passenger</button>
          </div>
        </form>
      </div>

      <div class="table-container glass-card mt-6">
        <table class="premium-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Passport</th>
              <th>Nationality</th>
              <th>DOB</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of passengers()" class="table-row">
              <td>#{{ p.passengerId }}</td>
              <td><strong>{{ p.firstName }} {{ p.lastName }}</strong></td>
              <td>
                <div class="contact-info">
                  <span><i-lucide name="mail" class="mini-icon"></i-lucide> {{ p.email }}</span>
                  <span><i-lucide name="phone" class="mini-icon"></i-lucide> {{ p.phone }}</span>
                </div>
              </td>
              <td><span class="badge">{{ p.passportNo }}</span></td>
              <td>{{ p.nationality }}</td>
              <td>{{ p.dateOfBirth | date:'mediumDate' }}</td>
              <td class="actions">
                <button class="icon-btn edit" (click)="editPassenger(p)" title="Edit">
                  <i-lucide name="edit-2"></i-lucide>
                </button>
                <button class="icon-btn delete" (click)="deletePassenger(p.passengerId!)" title="Delete">
                  <i-lucide name="trash-2"></i-lucide>
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
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; }
    .form-group input { width: 100%; padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 0.8rem; background: rgba(255,255,255,0.9); }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; }
    .premium-table { width: 100%; border-collapse: collapse; text-align: left; }
    .premium-table th { padding: 1.2rem 1rem; border-bottom: 2px solid #eee; color: #777; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
    .premium-table td { padding: 1.2rem 1rem; border-bottom: 1px solid #eee; }
    .contact-info { display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.85rem; color: #555; }
    .mini-icon { width: 14px; height: 14px; vertical-align: middle; margin-right: 4px; color: #888; }
    .badge { background: #F3E5F5; color: #7B1FA2; padding: 0.2rem 0.6rem; border-radius: 2rem; font-weight: 600; font-size: 0.8rem; }
    .actions { display: flex; gap: 0.5rem; }
    .icon-btn { border: none; background: none; padding: 0.5rem; cursor: pointer; border-radius: 0.5rem; transition: all 0.2s; }
    .icon-btn.edit { color: #2196F3; }
    .icon-btn.delete { color: #F44336; }
    .btn-primary { background: #000; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: all 0.3s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .mt-6 { margin-top: 1.5rem; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PassengerManagementComponent implements OnInit {
  passengers = signal<Passenger[]>([]);
  showForm = signal(false);
  currentPassenger: Passenger = this.resetPassenger();
  editingId: number | null = null;

  constructor(private passengerService: PassengerService) { }

  ngOnInit() {
    this.loadPassengers();
  }

  loadPassengers() {
    this.passengerService.getAllPassengers().subscribe(data => this.passengers.set(data));
  }

  resetPassenger(): Passenger {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      passportNo: '',
      nationality: '',
      dateOfBirth: ''
    };
  }

  savePassenger() {
    if (this.editingId) {
      this.passengerService.updatePassenger(this.editingId, this.currentPassenger).subscribe(() => {
        this.loadPassengers();
        this.cancelEdit();
      });
    } else {
      this.passengerService.createPassenger(this.currentPassenger).subscribe(() => {
        this.loadPassengers();
        this.currentPassenger = this.resetPassenger();
        this.showForm.set(false);
      });
    }
  }

  editPassenger(p: Passenger) {
    this.editingId = p.passengerId!;
    this.currentPassenger = { ...p };
    this.showForm.set(true);
  }

  cancelEdit() {
    this.editingId = null;
    this.currentPassenger = this.resetPassenger();
    this.showForm.set(false);
  }

  deletePassenger(id: number) {
    if (confirm('Are you sure you want to delete this passenger?')) {
      this.passengerService.deletePassenger(id).subscribe({
        next: () => {
          this.loadPassengers();
        },
        error: (err) => {
          console.error('Error deleting passenger:', err);
          alert('Could not delete passenger. They might have active bookings that cannot be removed.');
        }
      });
    }
  }
}
