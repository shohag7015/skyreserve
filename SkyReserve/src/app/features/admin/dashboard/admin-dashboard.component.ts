import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardService } from "../../../core/services/dashboard.service";
import { DashboardStats } from "../../../core/models/dashboard.model";
import { LucideAngularModule } from "lucide-angular";
import {
  animate,
  style,
  transition,
  trigger,
  query,
  stagger,
} from "@angular/animations";

import { RouterLink } from "@angular/router";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  template: `

      <div class="p-8 max-w-7xl mx-auto space-y-10" [@pageTransition]>
        <!-- Header -->
        <header
          class="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 class="text-5xl font-black text-slate-900 tracking-tight">
              Admin <span class="text-secondary">Dashboard</span>
            </h1>
            <p class="text-slate-500 mt-3 text-lg font-medium">
              Real-time overview of system performance and activity.
            </p>
          </div>
<div
  class="flex items-center gap-3 bg-gradient-to-r from-green-400/20 to-emerald-500/20 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-white/30 hover:shadow-lg transition-all duration-300"
>
  
  <div
    class="relative w-10 h-10 bg-green-500/20 text-green-600 rounded-xl flex items-center justify-center"
  >
    <lucide-icon name="activity" class="w-6 h-6"></lucide-icon>

    <!-- 🔥 Live pulse dot -->
    <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
  </div>

  <span class="font-bold text-green-700 pr-2 tracking-wide">
    System Live
  </span>

</div>
        </header>

        <!-- Stats Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          [@staggerCards]
        >
          <!-- Revenue Card -->
          <div class="stat-card group cursor-pointer bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500"
>
            <div  class="flex justify-between items-start mb-6">
              <div class="icon-box bg-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-all duration-300">
                <lucide-icon name="dollar-sign" class="w-7 h-7"></lucide-icon>
              </div>
              <span
                class="text-xs font-black text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full"
                >+12.5%</span
              >
            </div>
            <h3
              class="text-white/80 font-bold text-sm uppercase tracking-widest mb-1"
            >
              Total Revenue
            </h3>
            <p
              class="text-4xl font-black group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
  >
              \${{ stats()?.totalRevenue | number: "1.2-2" }}
            </p>
          </div>

          <!-- Bookings Card -->

<div
  class="stat-card group cursor-pointer bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500"
  routerLink="/admin/bookings"
>
  <div class="flex justify-between items-start mb-6">
    
    <div class="icon-box bg-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-all duration-300">
      <lucide-icon name="ticket" class="w-7 h-7"></lucide-icon>
    </div>

    <span
      class="text-xs font-black text-white bg-white/20 px-3 py-1 rounded-full backdrop-blur-md group-hover:scale-110 transition"
    >
      +8.2%
    </span>

  </div>

  <h3
    class="text-white/80 font-bold text-sm uppercase tracking-widest mb-1"
  >
    Total Bookings
  </h3>

  <p
    class="text-4xl font-black group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
  >
    {{ stats()?.totalBookings }}
  </p>
</div>

          <!-- Flights Card -->
          <div
  class="stat-card group cursor-pointer bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500"
  routerLink="/admin/flights"
>
  <div class="flex justify-between items-start mb-6">
    <div class="icon-box bg-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-all duration-300">
      <lucide-icon name="plane" class="w-7 h-7"></lucide-icon>
    </div>
  </div>

  <h3
    class="text-white/80 font-bold text-sm uppercase tracking-widest mb-1"
  >
    Total Flights
  </h3>

  <p
    class="text-4xl font-black group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
  >
    {{ stats()?.totalFlights }}
  </p>
</div>

          <!-- Users Card -->
<div
  class="stat-card group cursor-pointer bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500"
  routerLink="/admin/users"
>
  <div class="flex justify-between items-start mb-6">
    <div class="icon-box bg-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-all duration-300">
      <lucide-icon name="users" class="w-7 h-7"></lucide-icon>
    </div>
  </div>

  <h3 class="text-white/80 font-bold text-sm uppercase tracking-widest mb-1">
    Total Users
  </h3>

  <p class="text-4xl font-black group-hover:scale-110 transition-all duration-300 drop-shadow-lg">
    {{ stats()?.totalUsers }}
  </p>
</div>

          <!-- Airlines Card -->
<div
  class="stat-card group cursor-pointer bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500"
>
  <div class="flex justify-between items-start mb-6">
    
    <div class="icon-box bg-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-all duration-300">
      <lucide-icon name="shield-check" class="w-7 h-7"></lucide-icon>
    </div>

  </div>

  <h3
    class="text-white/80 font-bold text-sm uppercase tracking-widest mb-1"
  >
    Total Airlines
  </h3>

  <p
    class="text-4xl font-black group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
  >
    {{ stats()?.totalAirlines }}
  </p>
</div>

          <!-- Airports Card -->
<div
  class="stat-card group cursor-pointer bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500"
  routerLink="/admin/airports"
>
  <div class="flex justify-between items-start mb-6">
    <div class="icon-box bg-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-all duration-300">
      <lucide-icon name="map-pin" class="w-7 h-7"></lucide-icon>
    </div>
  </div>

  <h3 class="text-white/80 font-bold text-sm uppercase tracking-widest mb-1">
    Total Airports
  </h3>

  <p class="text-4xl font-black group-hover:scale-110 transition-all duration-300 drop-shadow-lg">
    {{ stats()?.totalAirports }}
  </p>
</div>

          <!-- Cities Card -->
<div
  class="stat-card group cursor-pointer bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500"
  routerLink="/admin/cities"
>
  <div class="flex justify-between items-start mb-6">
    <div class="icon-box bg-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-all duration-300">
      <lucide-icon name="building-2" class="w-7 h-7"></lucide-icon>
    </div>
  </div>

  <h3 class="text-white/80 font-bold text-sm uppercase tracking-widest mb-1">
    Total Cities
  </h3>

  <p class="text-4xl font-black group-hover:scale-110 transition-all duration-300 drop-shadow-lg">
    {{ stats()?.totalCities }}
  </p>
</div>

          <!-- Passengers Card -->
<div
  class="stat-card group cursor-pointer bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500"
  routerLink="/admin/passengers"
>
  <div class="flex justify-between items-start mb-6">
    <div class="icon-box bg-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-all duration-300">
      <lucide-icon name="user-check" class="w-7 h-7"></lucide-icon>
    </div>
  </div>

  <h3 class="text-white/80 font-bold text-sm uppercase tracking-widest mb-1">
    Total Passengers
  </h3>

  <p class="text-4xl font-black group-hover:scale-110 transition-all duration-300 drop-shadow-lg">
    {{ stats()?.totalPassengers }}
  </p>
</div>
        </div>

        <!-- Main Content Area -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Recent Bookings Table -->
          <div
            class="lg:col-span-2 bg-white/70 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white"
          >
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl font-black text-slate-900">
                Recent <span class="text-secondary">Bookings</span>
              </h2>
              <button
                routerLink="/admin/bookings"
                class="text-primary font-bold text-sm hover:underline"
              >
                View All
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-slate-100">
                    <th
                      class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest"
                    >
                      Passenger
                    </th>
                    <th
                      class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest"
                    >
                      Status
                    </th>
                    <th
                      class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest"
                    >
                      Amount
                    </th>
                    <th
                      class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-right"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  @for (
                    booking of stats()?.recentBookings ?? [];
                    track booking.bookingId
                  ) {
                    <tr class="group hover:bg-slate-50/50 transition-colors">
                      <td class="py-5">
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400"
                          >
                            {{ booking.pnrNumber?.substring(0, 2) }}
                          </div>
                          <span class="font-bold text-slate-700"
                            >#{{ booking.bookingId }} ({{
                              booking.pnrNumber
                            }})</span
                          >
                        </div>
                      </td>
                      <td class="py-5">
                        <span [class]="'status-badge ' + booking.bookingStatus">
                          {{ booking.bookingStatus }}
                        </span>
                      </td>
                      <td class="py-5 font-black text-slate-900">
                        \${{ booking.totalFare }}
                      </td>
                      <td
                        class="py-5 text-right text-slate-400 font-medium text-sm"
                      >
                        {{ booking.bookingDate | date: "MMM dd" }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- System Alerts / Notifications -->
          <div
            class="bg-primary p-8 rounded-[40px] shadow-2xl text-white space-y-8"
          >
            <h2 class="text-2xl font-black">
              System <span class="text-secondary">Shortcuts</span>
            </h2>

            <div class="space-y-4">
              <button
                class="shortcut-btn group bg-white/10 hover:bg-secondary hover:text-primary"
              >
                <lucide-icon name="plus-circle" class="w-5 h-5"></lucide-icon>
                <span class="font-bold">Add New Flight</span>
                <lucide-icon
                  name="chevron-right"
                  class="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                ></lucide-icon>
              </button>
              <button
                class="shortcut-btn group bg-white/10 hover:bg-secondary hover:text-primary"
              >
                <lucide-icon name="user-plus" class="w-5 h-5"></lucide-icon>
                <span class="font-bold">Register Airline</span>
                <lucide-icon
                  name="chevron-right"
                  class="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                ></lucide-icon>
              </button>
              <button
                class="shortcut-btn group bg-white/10 hover:bg-secondary hover:text-primary"
              >
                <lucide-icon name="file-text" class="w-5 h-5"></lucide-icon>
                <span class="font-bold">Generate Report</span>
                <lucide-icon
                  name="chevron-right"
                  class="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                ></lucide-icon>
              </button>
            </div>

            <div
              class="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl"
            >
              <div class="flex items-center gap-3 mb-4">
                <lucide-icon name="bell" class="text-secondary"></lucide-icon>
                <span class="font-bold">System Load</span>
              </div>
              <div class="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-secondary w-2/3"></div>
              </div>
              <p
                class="text-[10px] mt-2 opacity-50 uppercase tracking-widest font-bold text-center"
              >
                Server: Optimal (67%)
              </p>
            </div>
          </div>
        </div>
      </div>
  `,
  styles: [
    `
      .stat-card {
        @apply bg-white/70 backdrop-blur-xl p-8 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white transition-all duration-500;
      }
      .stat-card:hover {
        @apply -translate-y-2 shadow-2xl shadow-slate-300;
      }
      .icon-box {
        @apply w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500;
      }
      .stat-card:hover .icon-box {
        @apply scale-110 rotate-3;
      }
      .status-badge {
        @apply px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest;
      }
      .status-badge.CONFIRMED {
        @apply bg-emerald-100 text-emerald-600;
      }
      .status-badge.PENDING {
        @apply bg-amber-100 text-amber-600;
      }
      .status-badge.CANCELLED {
        @apply bg-rose-100 text-rose-600;
      }

      .shortcut-btn {
        @apply w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 text-left;
      }
    `,
  ],
  animations: [
    trigger("pageTransition", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(10px)" }),
        animate(
          "400ms cubic-bezier(0.16, 1, 0.3, 1)",
          style({ opacity: 1, transform: "translateY(0)" }),
        ),
      ]),
    ]),
    trigger("staggerCards", [
      transition(":enter", [
        query(".stat-card", [
          style({ opacity: 0, transform: "translateY(20px)" }),
          stagger("60ms", [
            animate(
              "400ms cubic-bezier(0.16, 1, 0.3, 1)",
              style({ opacity: 1, transform: "translateY(0)" }),
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  private dashboardService = inject(DashboardService);

  loading = signal(true);

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        this.stats.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Dashboard error:", err);
        this.loading.set(false);
      },
    });
  }
}
