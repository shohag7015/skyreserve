import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  template: `
    <nav class="bg-primary text-white shadow-lg sticky top-0 z-50 no-print">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
          <lucide-icon name="plane" class="text-secondary w-8 h-8"></lucide-icon>
          <span class="text-2xl font-bold tracking-tight">SkyReserve</span>
        </div>
        
        <div class="hidden md:flex items-center gap-8">
          <a routerLink="/" routerLinkActive="text-secondary" [routerLinkActiveOptions]="{exact:true}" class="hover:text-secondary transition-colors font-medium">Home</a>
          @if (authService.currentUser()) {
            <a routerLink="/my-bookings" routerLinkActive="text-secondary" class="flex items-center gap-2 hover:text-secondary transition-colors font-medium">
              <lucide-icon name="history" class="w-4 h-4"></lucide-icon> My Bookings
            </a>
            @if (authService.currentUser()?.role === 'ADMIN') {
              <div class="flex items-center gap-6 ml-4 pl-4 border-l border-white/20">
                <a routerLink="/admin/dashboard" routerLinkActive="text-secondary" class="hover:text-secondary transition-colors font-bold text-sm uppercase tracking-wider">Dashboard</a>
                <a routerLink="/admin/cities" routerLinkActive="text-secondary" class="hover:text-secondary transition-colors font-bold text-sm uppercase tracking-wider">Cities</a>
                <a routerLink="/admin/airlines" routerLinkActive="text-secondary" class="hover:text-secondary transition-colors font-bold text-sm uppercase tracking-wider">Airlines</a>
                <a routerLink="/admin/airports" routerLinkActive="text-secondary" class="hover:text-secondary transition-colors font-bold text-sm uppercase tracking-wider">Airports</a>
                <a routerLink="/admin/flights" routerLinkActive="text-secondary" class="hover:text-secondary transition-colors font-bold text-sm uppercase tracking-wider">Flights</a>
                <a routerLink="/admin/bookings" routerLinkActive="text-secondary" class="hover:text-secondary transition-colors font-bold text-sm uppercase tracking-wider">Bookings</a>
                <a routerLink="/admin/users" routerLinkActive="text-secondary" class="hover:text-secondary transition-colors font-bold text-sm uppercase tracking-wider">Users</a>
              </div>
            }
            <div class="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
              <span class="text-sm opacity-80">Hello, {{ authService.currentUser()?.name }}</span>
              <button (click)="authService.logout()" class="p-2 hover:bg-white/10 rounded-full">
                <lucide-icon name="log-out" class="w-5 h-5 text-red-400"></lucide-icon>
              </button>
            </div>
          } @else {
            <a routerLink="/auth/login" class="btn-secondary flex items-center gap-2">
              <lucide-icon name="user" class="w-4 h-4"></lucide-icon> Sign In
            </a>
          }
        </div>
      </div>
    </nav>

    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-slate-900 text-white py-12 mt-20 no-print">
      <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <lucide-icon name="plane" class="text-secondary w-6 h-6"></lucide-icon>
            <span class="text-xl font-bold">SkyReserve</span>
          </div>
          <p class="text-slate-400 text-sm">Elevating your travel experience with seamless booking and world-class service.</p>
        </div>
        <div>
          <h4 class="font-bold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-slate-400 text-sm">
            <li><a href="#" class="hover:text-secondary">About Us</a></li>
            <li><a href="#" class="hover:text-secondary">Careers</a></li>
            <li><a href="#" class="hover:text-secondary">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">Support</h4>
          <ul class="space-y-2 text-slate-400 text-sm">
            <li><a href="#" class="hover:text-secondary">Help Center</a></li>
            <li><a href="#" class="hover:text-secondary">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-secondary">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">Newsletter</h4>
          <div class="flex gap-2">
            <input type="email" placeholder="Email address" class="bg-slate-800 border-none rounded-l-lg px-4 py-2 w-full text-sm">
            <button class="bg-secondary px-4 py-2 rounded-r-lg font-bold">Join</button>
          </div>
        </div>
      </div>
      <div class="container mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
        &copy; 2025 SkyReserve Air Ticket Reservation System. All rights reserved.
      </div>
    </footer>
  `
})
export class AppComponent {
  authService = inject(AuthService);
}
