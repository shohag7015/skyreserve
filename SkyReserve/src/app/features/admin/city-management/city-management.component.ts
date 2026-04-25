import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CityService } from '../../../core/services/city.service';
import { City } from '../../../core/models/city.model';

@Component({
  selector: 'app-city-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
<div class="container mx-auto px-6 py-8">

  <!-- Header -->
  <div class="flex justify-between items-center mb-10">
    
    <div>
      <h1 class="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        City Management
      </h1>
      <p class="text-slate-500 mt-2">
        Add, update, or remove cities in the system
      </p>
    </div>

    <button
      class="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
      (click)="openModal()"
    >
      <lucide-icon name="plus" class="w-5 h-5 group-hover:rotate-90 transition"></lucide-icon>
      Add New City
    </button>

  </div>

  <!-- Table Card -->
  <div class="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-white/40 overflow-hidden">

    <div class="overflow-x-auto">

      <table class="w-full text-left border-collapse">

        <!-- Table Head -->
        <thead>
          <tr class="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
            <th class="p-6 font-bold text-slate-600">ID</th>
            <th class="p-6 font-bold text-slate-600">City Name</th>
            <th class="p-6 font-bold text-slate-600">Country</th>
            <th class="p-6 font-bold text-slate-600 text-right">Actions</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>

          <tr *ngFor="let city of cities()"
              class="border-b border-slate-100 hover:bg-blue-50/40 transition-all duration-200">

            <td class="p-6 text-slate-500 font-medium">#{{ city.cityId }}</td>

            <td class="p-6 font-bold text-slate-800">
              {{ city.cityName }}
            </td>

            <td class="p-6 text-slate-600">
              {{ city.country }}
            </td>

            <td class="p-6">
              <div class="flex items-center justify-end gap-3">

                <!-- Edit -->
                <button
                  (click)="editCity(city)"
                  class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <lucide-icon name="edit-2" class="w-4 h-4"></lucide-icon>
                </button>

                <!-- Delete -->
                <button
                  (click)="deleteCity(city.cityId!)"
                  class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
                </button>

              </div>
            </td>

          </tr>

          <!-- Empty State -->
          <tr *ngIf="cities().length === 0">
            <td colspan="4" class="p-12 text-center text-slate-500">

              <lucide-icon name="map-pin"
                class="w-14 h-14 mx-auto text-slate-300 mb-4 animate-bounce">
              </lucide-icon>

              <p class="text-lg font-semibold text-slate-700 mb-1">
                No cities found
              </p>

              <p class="text-sm text-slate-500">
                Get started by adding a new city to the database.
              </p>

            </td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>

</div>

    <!-- Modal -->
    <div *ngIf="isModalOpen()" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" (click)="$event.stopPropagation()">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 class="text-xl font-bold text-slate-800">{{ editingCity() ? 'Edit City' : 'Add New City' }}</h3>
          <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>
        
        <form (ngSubmit)="saveCity()" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">City Name</label>
            <input type="text" [(ngModel)]="currentCity.cityName" name="cityName" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" placeholder="e.g. New York">
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Country</label>
            <input type="text" [(ngModel)]="currentCity.country" name="country" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" placeholder="e.g. United States">
          </div>

          <div class="flex gap-4 pt-4">
            <button type="button" (click)="closeModal()" class="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" class="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-secondary hover:bg-secondary/90 transition-colors">
              {{ editingCity() ? 'Save Changes' : 'Create City' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CityManagementComponent implements OnInit {
  private cityService = inject(CityService);

  cities = signal<City[]>([]);
  isModalOpen = signal(false);
  editingCity = signal<City | null>(null);

  currentCity: City = {
    cityName: '',
    country: ''
  };

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.cityService.getAllCities().subscribe(data => {
      this.cities.set(data);
    });
  }

  openModal() {
    this.editingCity.set(null);
    this.currentCity = { cityName: '', country: '' };
    this.isModalOpen.set(true);
  }

  editCity(city: City) {
    this.editingCity.set(city);
    this.currentCity = { ...city };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveCity() {
    if (this.currentCity.cityName && this.currentCity.country) {
      if (this.editingCity()) {
        this.cityService.updateCity(this.editingCity()!.cityId!, this.currentCity).subscribe(() => {
          this.loadCities();
          this.closeModal();
        });
      } else {
        this.cityService.createCity(this.currentCity).subscribe(() => {
          this.loadCities();
          this.closeModal();
        });
      }
    }
  }

  deleteCity(id: number) {
    if (confirm('Are you sure you want to delete this city?')) {
      this.cityService.deleteCity(id).subscribe(() => {
        this.loadCities();
      });
    }
  }
}
