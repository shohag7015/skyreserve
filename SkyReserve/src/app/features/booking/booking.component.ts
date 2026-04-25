import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FlightService } from '../../core/services/flight.service';
import { BookingService } from '../../core/services/booking.service';
import { PassengerService } from '../../core/services/passenger.service';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    @if (flight) {
      <div class="container mx-auto px-6 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div class="lg:col-span-2 space-y-8">
            <section class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8" *ngFor="let p of passengers; let i = index">
              <h2 class="text-2xl font-bold mb-8 flex items-center gap-3">
                <span class="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center text-sm">{{i + 1}}</span>
                Passenger Details ({{p.type}})
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-600">First Name</label>
                  <input [(ngModel)]="p.firstName" type="text" class="input-field" placeholder="e.g. John">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-600">Last Name</label>
                  <input [(ngModel)]="p.lastName" type="text" class="input-field" placeholder="e.g. Doe">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-600">Email Address</label>
                  <input [(ngModel)]="p.email" type="email" class="input-field" placeholder="john@example.com">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-600">Passport Number</label>
                  <input [(ngModel)]="p.passportNo" type="text" class="input-field" placeholder="A12345678">
                </div>
                 <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-600">Phone</label>
                  <input [(ngModel)]="p.phone" type="text" class="input-field" placeholder="+123456789">
                </div>
              </div>
            </section>

            <!-- ... Section 2 & 3 remain similar but simplified ... -->
            <section class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 class="text-2xl font-bold mb-8 flex items-center gap-3">
                <span class="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center text-sm">2</span>
                Choose Class
              </h2>
              <div class="flex gap-4">
                <button (click)="classTypeStyle = 'ECONOMY'" [class.border-secondary]="classTypeStyle === 'ECONOMY'" class="flex-1 p-4 border rounded-xl font-bold transition-all">ECONOMY</button>
                <button (click)="classTypeStyle = 'BUSINESS'" [class.border-secondary]="classTypeStyle === 'BUSINESS'" class="flex-1 p-4 border rounded-xl font-bold transition-all">BUSINESS</button>
              </div>
            </section>

            <section class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 class="text-2xl font-bold mb-8 flex items-center gap-3">
                    <span class="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center text-sm">3</span>
                    Confirm Booking
                </h2>
                <button (click)="confirmBooking()" [disabled]="!isFormValid()" class="btn-primary w-full py-5 text-xl mt-8 shadow-xl shadow-primary/10">
                    Pay & Confirm Booking
                </button>
            </section>
          </div>

          <div class="lg:col-span-1">
            <div class="sticky top-28 space-y-6">
              <div class="bg-primary text-white p-8 rounded-3xl shadow-xl">
                <h3 class="font-bold text-xl mb-6">Fare Summary</h3>
                <div class="space-y-4 text-white/80">
                  <div class="flex justify-between" *ngIf="flightService.searchCriteria().travelers.adults > 0">
                    <span>Adult x {{ flightService.searchCriteria().travelers.adults }} ({{ classTypeStyle }})</span>
                    <span class="text-white font-bold">$ {{ getAdultFare() | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between" *ngIf="flightService.searchCriteria().travelers.children > 0">
                    <span>Child x {{ flightService.searchCriteria().travelers.children }}</span>
                    <span class="text-white font-bold">$ {{ getChildFare() | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between" *ngIf="flightService.searchCriteria().travelers.infants > 0">
                    <span>Infant x {{ flightService.searchCriteria().travelers.infants }}</span>
                    <span class="text-white font-bold">$ {{ getInfantFare() | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Govt. Tax (15%)</span>
                    <span class="text-white font-bold">$ {{ (getCurrentFare() * 0.15) | number:'1.2-2' }}</span>
                  </div>
                  <div class="pt-4 border-t border-white/10 flex justify-between">
                    <span class="text-lg font-bold text-white uppercase tracking-wider">Total</span>
                    <span class="text-3xl font-black text-secondary">$ {{ (getCurrentFare() * 1.15) | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h4 class="font-bold mb-4">Flight Summary</h4>
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ flight.fromCode }}</p>
                        <h5 class="text-xl font-bold">{{ flight.departureTime | date:'HH:mm' }}</h5>
                    </div>
                    <lucide-icon name="plane" class="w-5 h-5 text-slate-300"></lucide-icon>
                    <div class="text-right">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ flight.toCode }}</p>
                        <h5 class="text-xl font-bold">{{ flight.arrivalTime | date:'HH:mm' }}</h5>
                    </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .input-field {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.8rem;
      transition: all 0.3s ease;
    }
    .input-field:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .btn-primary {
      background: #1e293b;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 1rem;
      font-weight: 700;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .btn-primary:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }
  `]
})
export class BookingComponent implements OnInit {
  @Input() flightId!: string;

  flight: any;
  passengers: any[] = [];
  classTypeStyle = 'ECONOMY';

  flightService = inject(FlightService);
  bookingService = inject(BookingService);
  passengerService = inject(PassengerService);
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    this.flight = this.flightService.getFlightById(Number(this.flightId));
    if (!this.flight) {
      this.router.navigate(['/search']);
      return;
    }

    this.classTypeStyle = this.flightService.searchCriteria().travelers.travelClass.toUpperCase();

    // Build passengers array based on travelers count from flight service
    const t = this.flightService.searchCriteria().travelers;
    for (let i = 0; i < t.adults; i++) {
      this.addPassengerForm('Adult');
    }
    for (let i = 0; i < t.children; i++) {
      this.addPassengerForm('Child (2-11)');
    }
    for (let i = 0; i < t.infants; i++) {
      this.addPassengerForm('Infant (<2)');
    }

    // Auto-fill primary passenger details if user has booked before
    const user = this.authService.currentUser();
    if (user && this.passengers.length > 0) {
      this.passengerService.getPassengerByUserId(user.id).subscribe(p => {
        if (p) {
          this.passengers[0] = {
            ...this.passengers[0],
            firstName: p.firstName,
            lastName: p.lastName,
            email: p.email,
            phone: p.phone,
            passportNo: p.passportNo,
            nationality: p.nationality || 'Bangladeshi',
            dateOfBirth: p.dateOfBirth || '2000-01-01'
          };
        }
      });
    }
  }

  addPassengerForm(type: string) {
    this.passengers.push({
      type,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      passportNo: '',
      nationality: 'Unknown',
      dateOfBirth: '2000-01-01'
    });
  }

  isFormValid() {
    return this.passengers.every(p => p.firstName && p.lastName && p.email && p.passportNo);
  }

  get baseFareForClass(): number {
    if (!this.flight) return 0;
    return this.classTypeStyle === 'BUSINESS'
      ? (this.flight.businessFare || this.flight.baseFare)
      : (this.flight.economyFare || this.flight.baseFare);
  }

  getAdultFare(): number {
    return this.baseFareForClass * this.flightService.searchCriteria().travelers.adults;
  }

  getChildFare(): number {
    return this.baseFareForClass * 0.75 * this.flightService.searchCriteria().travelers.children;
  }

  getInfantFare(): number {
    return this.baseFareForClass * 0.5 * this.flightService.searchCriteria().travelers.infants;
  }

  getCurrentFare(): number {
    return this.getAdultFare() + this.getChildFare() + this.getInfantFare();
  }

  confirmBooking() {
    if (!this.isFormValid() || !this.flight) return;

    const user = this.authService.currentUser();
    if (user) {
      this.passengers.forEach(p => p.userId = user.id);
    }

    // Use forkJoin to submit all passengers cleanly
    const createPassengerObs = this.passengers.map(p => {
      const payload = { ...p };
      delete payload.type;
      return this.passengerService.createPassenger(payload);
    });

    forkJoin(createPassengerObs).subscribe({
      next: (savedPassengers: any[]) => {
        const bookingData: any = {
          passengers: savedPassengers, // Pass the entire array referencing backend mapping
          flightId: this.flight.flightId,
          bookingStatus: 'PENDING',
          totalFare: +(this.getCurrentFare() * 1.15).toFixed(2),
          classType: this.classTypeStyle,
          userId: user ? user.id : 1, // Fallback safely to 1 if anonymous.
          noOfPassengers: this.flightService.getTotalTravelers()
        };

        this.bookingService.createBooking(bookingData).subscribe((b: any) => {
          this.router.navigate(['/payment', b.bookingId]);
        });
      },
      error: (err) => console.error(err)
    });
  }
}
