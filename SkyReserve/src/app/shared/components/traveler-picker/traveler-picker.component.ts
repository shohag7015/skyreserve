import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export interface TravelerData {
    adults: number;
    children: number;
    infants: number;
    travelClass: 'Economy' | 'Business';
}

@Component({
    selector: 'app-traveler-picker',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="relative w-full">
      <div 
        (click)="toggleDropdown()" 
        class="flex flex-col border-b border-slate-200 pb-2 cursor-pointer group">
        
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 cursor-pointer group-hover:text-secondary transition-colors">Traveler, Class</label>
        
        <div class="flex items-center gap-2">
          <div class="flex-1">
            <div class="font-bold text-lg text-slate-800 leading-tight">
              {{ totalTravelers }} Traveler{{ totalTravelers > 1 ? 's' : '' }}
            </div>
            <div class="text-sm text-slate-500">{{ data.travelClass }}</div>
          </div>
          <lucide-icon name="chevron-down" class="w-5 h-5 text-slate-400 group-hover:text-secondary transition-colors" [class.rotate-180]="showDropdown"></lucide-icon>
        </div>
      </div>

      <div *ngIf="showDropdown" 
           class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl z-[100] border border-slate-100 p-6">
        
        <!-- Adults -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="text-slate-800 text-sm font-medium">Adults</div>
            <div class="text-xs text-slate-400">12 years and above</div>
          </div>
          <div class="flex items-center gap-4">
            <button (click)="updateCount('adults', -1)" [disabled]="data.adults <= 1" 
                    class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-secondary hover:text-secondary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all">
              <lucide-icon name="minus" class="w-4 h-4"></lucide-icon>
            </button>
            <span class="w-4 text-center text-slate-800 font-medium">{{ data.adults }}</span>
            <button (click)="updateCount('adults', 1)" [disabled]="data.adults >= 9"
                    class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-secondary hover:text-secondary transition-all">
              <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Children -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="text-slate-800 text-sm font-medium">Children</div>
            <div class="text-xs text-slate-400">2-11 years</div>
          </div>
          <div class="flex items-center gap-4">
            <button (click)="updateCount('children', -1)" [disabled]="data.children <= 0" 
                    class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-secondary hover:text-secondary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all">
              <lucide-icon name="minus" class="w-4 h-4"></lucide-icon>
            </button>
            <span class="w-4 text-center text-slate-800 font-medium">{{ data.children }}</span>
            <button (click)="updateCount('children', 1)" [disabled]="data.children >= 9"
                    class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-secondary hover:text-secondary transition-all">
              <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Infants -->
        <div class="flex items-center justify-between mb-6 border-b border-slate-100 pb-6">
          <div>
            <div class="text-slate-800 text-sm font-medium">Infant</div>
            <div class="text-xs text-slate-400">Below 2 years</div>
          </div>
          <div class="flex items-center gap-4">
            <button (click)="updateCount('infants', -1)" [disabled]="data.infants <= 0" 
                    class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-secondary hover:text-secondary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all">
              <lucide-icon name="minus" class="w-4 h-4"></lucide-icon>
            </button>
            <span class="w-4 text-center text-slate-800 font-medium">{{ data.infants }}</span>
            <button (click)="updateCount('infants', 1)" [disabled]="data.infants >= data.adults"
                    class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-secondary hover:text-secondary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all">
              <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Class -->
        <div class="mb-8">
          <div class="text-slate-800 text-sm font-medium mb-3">Class</div>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="travelClass" [(ngModel)]="data.travelClass" value="Economy" class="w-4 h-4 text-secondary border-slate-300 focus:ring-secondary cursor-pointer">
              <span class="text-sm font-medium text-slate-700 group-hover:text-slate-900">Economy</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="travelClass" [(ngModel)]="data.travelClass" value="Business" class="w-4 h-4 text-secondary border-slate-300 focus:ring-secondary cursor-pointer">
              <span class="text-sm font-medium text-slate-700 group-hover:text-slate-900 text-slate-400">Business</span>
            </label>
          </div>
        </div>

        <!-- Done Button -->
        <div class="flex justify-end">
          <button (click)="closeDropdown()" class="bg-secondary hover:bg-secondary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  `
})
export class TravelerPickerComponent implements OnInit {
    @Input() data: TravelerData = { adults: 1, children: 0, infants: 0, travelClass: 'Economy' };
    @Output() dataChange = new EventEmitter<TravelerData>();

    showDropdown = false;

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
        if (!this.data) {
            this.data = { adults: 1, children: 0, infants: 0, travelClass: 'Economy' };
        }
    }

    get totalTravelers(): number {
        return this.data.adults + this.data.children + this.data.infants;
    }

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    closeDropdown() {
        this.showDropdown = false;
        this.emitChange();
    }

    updateCount(type: 'adults' | 'children' | 'infants', delta: number) {
        this.data[type] += delta;
        this.emitChange();
    }

    emitChange() {
        this.dataChange.emit({ ...this.data });
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            if (this.showDropdown) {
                this.closeDropdown();
            }
        }
    }
}
