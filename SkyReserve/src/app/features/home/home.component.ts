import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../core/services/flight.service';
import { LucideAngularModule } from 'lucide-angular';
import { CityAutocompleteComponent } from '../../shared/components/city-autocomplete/city-autocomplete.component';
import { TravelerPickerComponent, TravelerData } from '../../shared/components/traveler-picker/traveler-picker.component';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CityAutocompleteComponent, TravelerPickerComponent],
  template: `
    <div class="relative min-h-[700px] flex items-center justify-center text-white py-20">
      <div class="absolute inset-0 bg-cover bg-center z-0" style="background-image: url('https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=2070&auto=format&fit=crop');">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>
      
      <div class="relative z-10 w-full max-w-5xl px-6 text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Explore the World <br/> Beyond Horizons</h1>
        <p class="text-xl mb-12 opacity-90 max-w-2xl mx-auto">Find the best deals on hundreds of flights worldwide. Your journey begins with a single click.</p>
        
        <div class="bg-white p-8 rounded-3xl shadow-2xl text-slate-800 text-left">
          <!-- Trip Type Selector -->
          <div class="flex gap-6 mb-8 border-b border-slate-100 pb-4">
            <button (click)="tripType = 'one-way'" [class.text-secondary]="tripType === 'one-way'" [class.border-b-2]="tripType === 'one-way'" class="font-bold pb-2 transition-all border-secondary">One Way</button>
            <button (click)="tripType = 'round-trip'" [class.text-secondary]="tripType === 'round-trip'" [class.border-b-2]="tripType === 'round-trip'" class="font-bold pb-2 transition-all border-secondary">Round Trip</button>
            <button (click)="tripType = 'multi-city'" [class.text-secondary]="tripType === 'multi-city'" [class.border-b-2]="tripType === 'multi-city'" class="font-bold pb-2 transition-all border-secondary">Multi-City</button>
          </div>

          <!-- Search Form -->
          <div class="space-y-6">
            <div *ngFor="let segment of segments; let i = index" class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div class="md:col-span-4 relative">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">From</label>
                <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <lucide-icon name="map-pin" class="w-5 h-5 text-secondary"></lucide-icon>
                  <app-city-autocomplete [(cityId)]="segment.fromCityId" placeholder="Origin City" class="w-full"></app-city-autocomplete>
                </div>
              </div>
              
              <div class="md:col-span-4 relative">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">To</label>
                <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <lucide-icon name="map-pin" class="w-5 h-5 text-secondary"></lucide-icon>
                  <app-city-autocomplete [(cityId)]="segment.toCityId" placeholder="Destination City" class="w-full"></app-city-autocomplete>
                </div>
              </div>
              
              <div class="md:col-span-3 relative">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Departure</label>
                <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <lucide-icon name="calendar" class="w-5 h-5 text-secondary"></lucide-icon>
                  <input type="date" [(ngModel)]="segment.date" class="w-full focus:outline-none font-medium text-lg">
                </div>
              </div>

              <div class="md:col-span-1 flex justify-center pb-2" *ngIf="tripType === 'multi-city' && segments.length > 1">
                <button (click)="removeSegment(i)" class="text-slate-300 hover:text-red-500 transition-colors">
                  <lucide-icon name="trash-2" class="w-5 h-5"></lucide-icon>
                </button>
              </div>
            </div>

            <div *ngIf="tripType === 'round-trip'" class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
               <div class="md:col-span-4 md:col-start-9 relative">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Return Date</label>
                <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <lucide-icon name="calendar" class="w-5 h-5 text-secondary"></lucide-icon>
                  <input type="date" [(ngModel)]="returnDate" class="w-full focus:outline-none font-medium text-lg">
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-4 pt-4">
              <button *ngIf="tripType === 'multi-city'" (click)="addSegment()" class="text-secondary font-bold flex items-center gap-2 hover:opacity-80 transition-all">
                <lucide-icon name="plus-circle" class="w-5 h-5"></lucide-icon>
                Add another flight
              </button>
              
              <div class="flex gap-4 ml-auto w-full md:w-auto items-end">
                <div class="relative w-full md:w-60">
                  <app-traveler-picker [(data)]="travelerData"></app-traveler-picker>
                </div>

                <div class="w-full md:w-48 pb-2">
                  <button (click)="search()" class="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    <lucide-icon name="search" class="w-5 h-5"></lucide-icon>
                    Search Flights
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="container mx-auto px-6 py-24">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-primary mb-4">Why Book With Us?</h2>
        <div class="w-20 h-1.5 bg-secondary mx-auto rounded-full"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="w-16 h-16 bg-blue-50 text-secondary rounded-2xl flex items-center justify-center mb-6">
            <lucide-icon name="plane" class="w-8 h-8"></lucide-icon>
          </div>
          <h3 class="text-xl font-bold mb-4">Global Reach</h3>
          <p class="text-slate-500">Access thousands of routes and airlines globally with competitive pricing and real-time updates.</p>
        </div>
        <div class="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="w-16 h-16 bg-orange-50 text-accent rounded-2xl flex items-center justify-center mb-6">
            <lucide-icon name="credit-card" class="w-8 h-8"></lucide-icon>
          </div>
          <h3 class="text-xl font-bold mb-4">Secure Payment</h3>
          <p class="text-slate-500">Industry-leading encryption technology ensuring your transactions and data are always protected.</p>
        </div>
        <div class="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
            <lucide-icon name="check-circle" class="w-8 h-8"></lucide-icon>
          </div>
          <h3 class="text-xl font-bold mb-4">Instant E-Ticket</h3>
          <p class="text-slate-500">Receive your digital ticket immediately upon booking. No hassle, just paperless boarding.</p>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  tripType: 'one-way' | 'round-trip' | 'multi-city' = 'one-way';
  segments: { fromCityId?: number, toCityId?: number, date: string }[] = [{ date: todayStr }];
  returnDate = tomorrowStr;
  travelerData: TravelerData = { adults: 1, children: 0, infants: 0, travelClass: 'Economy' };

  router = inject(Router);
  flightService = inject(FlightService);

  addSegment() {
    if (this.segments.length < 5) {
      this.segments.push({ date: '' });
    }
  }

  removeSegment(index: number) {
    this.segments.splice(index, 1);
  }

  search() {
    this.flightService.updateSearch(
      this.tripType,
      this.segments,
      this.travelerData,
      this.tripType === 'round-trip' ? this.returnDate : undefined
    );
    this.router.navigate(['/search']);
  }
}
