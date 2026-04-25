import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search-results.component').then(m => m.SearchResultsComponent)
  },
  {
    path: 'booking/:flightId',
    loadComponent: () => import('./features/booking/booking.component').then(m => m.BookingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'confirmation/:bookingId',
    loadComponent: () => import('./features/confirmation/confirmation.component').then(m => m.ConfirmationComponent)
  },
  {
    path: 'payment/:bookingId',
    loadComponent: () => import('./features/payment/payment.component').then(m => m.PaymentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./features/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignUpComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'cities', loadComponent: () => import('./features/admin/city-management/city-management.component').then(m => m.CityManagementComponent) },
      { path: 'airlines', loadComponent: () => import('./features/admin/airline-management/airline-management.component').then(m => m.AirlineManagementComponent) },
      { path: 'airports', loadComponent: () => import('./features/admin/airport-management/airport-management.component').then(m => m.AirportManagementComponent) },
      { path: 'flights', loadComponent: () => import('./features/admin/flight-management/flight-management.component').then(m => m.FlightManagementComponent) },
      { path: 'passengers', loadComponent: () => import('./features/admin/passenger-management/passenger-management.component').then(m => m.PassengerManagementComponent) },
      { path: 'bookings', loadComponent: () => import('./features/admin/booking-management/booking-management.component').then(m => m.BookingManagementComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
