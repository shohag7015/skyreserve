import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="container mx-auto px-6 py-12 max-w-5xl">
      <div class="flex items-center gap-4 mb-10">
        <div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-secondary">
          <lucide-icon name="history"></lucide-icon>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-slate-900">My Bookings</h1>
          <p class="text-slate-500">Manage your reservations and boarding passes</p>
        </div>
      </div>

      @if (bookingService.bookings().length > 0) {
        <div class="space-y-6">
          @for (booking of bookingService.bookings(); track booking.bookingId) {
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div class="flex items-center gap-6">
                    <div class="w-12 h-12 bg-slate-50 rounded-xl border p-2 flex items-center justify-center">
                       <lucide-icon name="plane" class="text-secondary w-6 h-6"></lucide-icon>
                    </div>
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">#{{ booking.bookingId }}</span>
                        <span class="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase">{{ booking.bookingStatus }}</span>
                      </div>
                      <h3 class="text-xl font-bold">Flight #{{ booking.flightId }}</h3>
                      <p class="text-sm text-slate-500">PNR: {{ booking.pnrNumber }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-4 w-full md:w-auto">
                    <div class="text-right mr-4 hidden md:block">
                        <span class="text-xs text-slate-400 font-bold uppercase block">Total Price</span>
                        <span class="text-xl font-bold text-primary">\$ {{ booking.totalFare }}</span>
                    </div>
                    <button [routerLink]="['/confirmation', booking.bookingId]" class="btn-primary w-full md:w-auto">Boarding Pass</button>
                  </div>
               </div>
            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
           <lucide-icon name="calendar" size="48" class="text-slate-200 mx-auto mb-6"></lucide-icon>
           <h3 class="text-xl font-bold mb-2">No bookings yet</h3>
           <p class="text-slate-500 mb-8">Ready for your next adventure? Find your dream destination today.</p>
           <button routerLink="/search" class="btn-primary">Explore Flights</button>
        </div>
      }
    </div>
  `
})
export class MyBookingsComponent implements OnInit {
  bookingService = inject(BookingService);
  authService = inject(AuthService);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.bookingService.loadUserBookings(user.id);
    }
  }
}
