import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../core/models/flight.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-secondary/50 hover:shadow-xl transition-all duration-300">
      <div class="flex flex-col md:flex-row items-center gap-8">
        <!-- Airline Info -->
        <div class="flex items-center gap-4 w-full md:w-1/4">
          <div class="w-14 h-14 rounded-xl border border-slate-100 p-1 flex items-center justify-center bg-slate-50">
            <lucide-icon name="plane" class="text-secondary w-8 h-8"></lucide-icon>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-sm leading-tight">{{ flight.airlineName || 'Airline' }}</h4>
            <span class="text-xs text-slate-400 font-medium">{{ flight.airlineCode }} · {{ flight.flightNumber }}</span>
            <p class="text-[11px] text-secondary font-semibold mt-0.5 flex items-center gap-1">
              <span>{{ flight.fromCity || flight.fromCode }}</span>
              <span class="text-slate-300">→</span>
              <span>{{ flight.toCity || flight.toCode }}</span>
            </p>
          </div>
        </div>

        <!-- Flight Timeline -->
        <div class="flex-1 w-full grid grid-cols-3 items-center">
          <div class="text-center md:text-left">
            <h3 class="text-2xl font-bold tracking-tight text-slate-900">{{ flight.departureTime | date:'HH:mm' }}</h3>
            <p class="text-lg font-semibold text-slate-600 mb-0.5">{{ flight.fromCode }}</p>
            <p class="text-xs text-slate-400">{{ flight.fromCity }}</p>
          </div>

          <div class="flex flex-col items-center px-4">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{{ flight.durationMin }}m</span>
            <div class="relative w-full flex items-center">
              <div class="absolute inset-x-0 h-[1px] bg-slate-200"></div>
              <div class="absolute inset-x-0 flex justify-center">
                <lucide-icon name="plane" class="w-4 h-4 text-slate-300 rotate-90 bg-white px-0.5"></lucide-icon>
              </div>
            </div>
            <span class="text-[10px] font-semibold mt-2 px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">
              Direct
            </span>
          </div>

          <div class="text-center md:text-right">
            <h3 class="text-2xl font-bold tracking-tight text-slate-900">{{ flight.arrivalTime | date:'HH:mm' }}</h3>
            <p class="text-lg font-semibold text-slate-600 mb-0.5">{{ flight.toCode }}</p>
            <p class="text-xs text-slate-400">{{ flight.toCity }}</p>
          </div>
        </div>

        <!-- Price & Action -->
        <div class="w-full md:w-1/4 md:border-l border-slate-100 md:pl-8 flex md:flex-col items-center md:items-end justify-between gap-4">
          <div class="text-right">
            <span class="text-sm text-slate-400 font-medium">Starting at</span>
            <h2 class="text-3xl font-black text-primary">\$ {{ flight.economyFare || flight.baseFare }}</h2>
          </div>
          <button (click)="select.emit(flight.flightId!)" class="bg-slate-900 group-hover:bg-secondary text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md group-hover:shadow-secondary/20">
            Book Now
          </button>
        </div>
      </div>
    </div>
  `
})
export class FlightCardComponent {
  @Input({ required: true }) flight!: any;
  @Output() select = new EventEmitter<number>();
}
