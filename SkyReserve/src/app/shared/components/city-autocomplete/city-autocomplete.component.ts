import { Component, Input, Output, EventEmitter, inject, OnInit, OnChanges, SimpleChanges, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../core/services/flight.service';
import { City } from '../../../core/models/city.model';

@Component({
    selector: 'app-city-autocomplete',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="relative w-full">
      <input type="text"
             [placeholder]="placeholder"
             [(ngModel)]="searchTerm"
             (focus)="onFocus()"
             (input)="onInput()"
             class="w-full focus:outline-none font-medium text-lg bg-transparent">
             
      <div *ngIf="showDropdown && filteredCities.length > 0" 
           class="absolute left-0 right-0 z-[100] mt-2 w-full bg-white rounded-xl shadow-xl max-h-60 overflow-y-auto border border-slate-100">
        <ul class="py-2">
          <li *ngFor="let city of filteredCities" 
              (click)="selectCity(city)"
              class="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors text-slate-800 grid">
            <span class="font-bold text-base">{{ city.cityName }}</span>
            <span class="text-xs text-slate-500">{{ city.country }}</span>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class CityAutocompleteComponent implements OnInit, OnChanges {
    @Input() cityId?: number;
    @Input() placeholder = 'Select City';
    @Output() cityIdChange = new EventEmitter<number | undefined>();

    flightService = inject(FlightService);
    elementRef = inject(ElementRef);

    searchTerm = '';
    showDropdown = false;
    filteredCities: City[] = [];

    ngOnInit() {
        this.updateSearchTermFromId();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['cityId']) {
            this.updateSearchTermFromId();
        }
    }

    updateSearchTermFromId() {
        if (this.cityId) {
            const city = this.flightService.availableCities().find(c => c.cityId === this.cityId);
            if (city) {
                this.searchTerm = `${city.cityName}, ${city.country}`;
            } else {
                this.searchTerm = '';
            }
        } else {
            this.searchTerm = '';
        }
    }

    onFocus() {
        this.showDropdown = true;
        this.filterCities();
    }

    onInput() {
        this.showDropdown = true;
        this.filterCities();
        if (!this.searchTerm) {
            this.cityId = undefined;
            this.cityIdChange.emit(this.cityId);
        }
    }

    filterCities() {
        const allCities = this.flightService.availableCities();
        if (!this.searchTerm) {
            this.filteredCities = allCities;
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredCities = allCities.filter(c =>
                c.cityName.toLowerCase().includes(term) ||
                c.country.toLowerCase().includes(term)
            );
        }
    }

    selectCity(city: City) {
        this.cityId = city.cityId;
        this.searchTerm = `${city.cityName}, ${city.country}`;
        this.showDropdown = false;
        this.cityIdChange.emit(this.cityId);
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showDropdown = false;
            this.updateSearchTermFromId();
        }
    }
}
