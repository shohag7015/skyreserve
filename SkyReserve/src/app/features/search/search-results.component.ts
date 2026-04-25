import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FlightService } from '../../core/services/flight.service';
import { FlightCardComponent } from './flight-card.component';
import { LucideAngularModule } from 'lucide-angular';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FlightCardComponent, LucideAngularModule, FormsModule],
  template: `
    <div class="bg-primary text-white py-12">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span class="text-secondary font-semibold tracking-widest uppercase text-sm">Search Results</span>
            <h2 class="text-3xl font-bold">
              {{ flightService.getCityNameById(flightService.searchCriteria().segments[0].fromCityId) }} 
              <span class="mx-3 text-white/40">→</span> 
              {{ flightService.getCityNameById(flightService.searchCriteria().segments[0].toCityId) }}
            </h2>
            <p class="text-white/60 mt-2 flex items-center gap-2">
              <lucide-icon name="calendar" class="w-4 h-4"></lucide-icon>
              {{ flightService.searchCriteria().segments[0].date }} | 
              <lucide-icon name="user" class="w-4 h-4 ml-2"></lucide-icon>
              {{ flightService.getTotalTravelers() }} Traveler{{ flightService.getTotalTravelers() > 1 ? 's' : '' }}, {{ flightService.searchCriteria().travelers.travelClass }} | 
              {{ flightService.filteredFlights().length }} Flights Found
            </p>
          </div>
          <button routerLink="/" class="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/10">
            Modify Search
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-12">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-1/4">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
              <lucide-icon name="search" class="w-5 h-5 text-secondary"></lucide-icon>
              Refine Search
            </h3>
            
            <div class="space-y-8">
              <div>
                <label class="font-semibold text-sm mb-3 block">Airlines</label>
                <div class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  @for (airline of flightService.availableAirlines(); track airline.airlineId) {
                    <label class="flex items-center gap-3 text-slate-600 cursor-pointer">
                      <input type="checkbox" 
                        [checked]="flightService.filters().airlines.length === 0 || flightService.filters().airlines.includes(airline.airlineId!)"
                        (change)="flightService.toggleAirlineFilter(airline.airlineId!)"
                        class="w-4 h-4 rounded text-secondary focus:ring-secondary">
                      <span class="text-sm">{{ airline.airlineName }}</span>
                    </label>
                  }
                </div>
              </div>

              <div>
                <label class="font-semibold text-sm mb-3 block flex justify-between">
                  Price Range
                  <span class="text-secondary font-bold">Up to \${{ flightService.filters().maxPrice }}</span>
                </label>
                <input type="range" 
                  [ngModel]="flightService.filters().maxPrice" 
                  (ngModelChange)="flightService.updatePriceFilter($event)"
                  min="50" max="3000" step="50" 
                  class="w-full accent-secondary">
                <div class="flex justify-between text-xs text-slate-400 mt-2">
                  <span>$50</span>
                  <span>$3,000</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="w-full lg:w-3/4">
          @if (flightService.filteredFlights().length > 0) {
            <div class="space-y-6">
              @for (flight of flightService.filteredFlights(); track flight.flightId) {
                <app-flight-card [flight]="flight" (select)="onFlightSelect($event)" />
              }
            </div>
          } @else {
            <div class="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
              <div class="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <lucide-icon name="plane" class="w-10 h-10"></lucide-icon>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-2">No Flights Found</h3>
              <p class="text-slate-500 mb-8">Try adjusting your destinations or dates to see more results.</p>
              <button routerLink="/" class="btn-primary">Go Home</button>
            </div>
          }
        </main>
      </div>
    </div>
  `
})
export class SearchResultsComponent {
  flightService = inject(FlightService);
  router = inject(Router);

  onFlightSelect(id: number) {
    this.router.navigate(['/booking', id]);
  }
}
