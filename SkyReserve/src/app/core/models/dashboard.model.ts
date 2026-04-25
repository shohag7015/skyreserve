import { Booking } from './flight.model';

export interface DashboardStats {
    totalRevenue: number;
    totalBookings: number;
    totalFlights: number;
    totalUsers: number;
    totalAirlines: number;
    totalAirports: number;
    totalCities: number;
    totalPassengers: number;
    recentBookings: Booking[];
}
