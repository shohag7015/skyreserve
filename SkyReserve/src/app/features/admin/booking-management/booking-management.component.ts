import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { FlightService } from '../../../core/services/flight.service';
import { PassengerService } from '../../../core/services/passenger.service';
import { LucideAngularModule } from 'lucide-angular';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="p-8 animate-in fade-in duration-700">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">Booking <span class="text-secondary">Management</span></h1>
          <p class="text-slate-500 mt-2 font-medium">View and manage all flight reservations</p>
        </div>
      </div>

      <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="px-6 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">PNR / ID</th>
              <th class="px-6 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Passenger</th>
              <th class="px-6 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Flight</th>
              <th class="px-6 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th class="px-6 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Fare</th>
              <th class="px-6 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (booking of enrichedBookings; track booking.bookingId) {
              <tr class="hover:bg-blue-50/30 transition-colors group">
                <td class="px-6 py-5">
                  <div class="flex flex-col">
                    <span class="font-black text-slate-900">{{ booking.pnrNumber }}</span>
                    <span class="text-xs text-slate-400">#{{ booking.bookingId }}</span>
                  </div>
                </td>
                <td class="px-6 py-5 font-bold text-slate-700">
                  {{ booking.passengerName }}
                </td>
                <td class="px-6 py-5">
                  <div class="flex items-center gap-2">
                    <lucide-icon name="plane" class="w-4 h-4 text-slate-300"></lucide-icon>
                    <span class="font-semibold text-slate-600">{{ booking.flightNumber }}</span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <span [class]="getStatusClass(booking.bookingStatus)" class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    {{ booking.bookingStatus }}
                  </span>
                </td>
                <td class="px-6 py-5 font-black text-primary">
                  \${{ booking.totalFare }}
                </td>
                <td class="px-6 py-5 text-right">
                  @if (booking.bookingStatus !== 'CANCELLED') {
                    <button (click)="cancelBooking(booking.bookingId)" class="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Cancel Booking">
                      <lucide-icon name="slash" class="w-5 h-5"></lucide-icon>
                    </button>
                  }
                  <button (click)="deleteBooking(booking.bookingId)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Booking Permanently">
                    <lucide-icon name="trash-2" class="w-5 h-5"></lucide-icon>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class BookingManagementComponent implements OnInit {
  bookingService = inject(BookingService);
  passengerService = inject(PassengerService);
  flightService = inject(FlightService);

  bookings: any[] = [];
  enrichedBookings: any[] = [];

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAllBookings().subscribe(data => {
      this.bookings = data;
      this.enrichData();
    });
  }

  enrichData() {
    // We'll use the already loaded services in flightService to enrich
    this.enrichedBookings = this.bookings.map(b => {
      const flight = this.flightService.getFlightById(b.flightId);
      return {
        ...b,
        passengerName: 'Loading...', // Ideally we'd fetch this or it's in a DTO
        flightNumber: flight ? flight.flightNumber : `Flight #${b.flightId}`
      };
    });

    // Optionally fetch passenger names (simulated for now or fetch if needed)
    this.enrichedBookings.forEach((b, index) => {
      this.passengerService.getPassengerById(b.passengerId).subscribe(p => {
        this.enrichedBookings[index].passengerName = `${p.firstName} ${p.lastName}`;
      });
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'PENDING': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  cancelBooking(id: number) {
    if (confirm('Are you sure you want to cancel this booking? This will restore seat inventory.')) {
      this.bookingService.cancelBooking(id).subscribe(() => {
        this.loadBookings();
      });
    }
  }

  deleteBooking(id: number) {
    if (confirm('Are you sure you want to PERMANENTLY delete this booking? This action cannot be undone.')) {
      this.bookingService.deleteBooking(id).subscribe(() => {
        this.loadBookings();
      });
    }
  }
}
