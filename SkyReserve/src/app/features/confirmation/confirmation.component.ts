import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { FlightService } from '../../core/services/flight.service';
import { PassengerService } from '../../core/services/passenger.service';
import { Booking } from '../../core/models/flight.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="container mx-auto px-6 py-12 max-w-5xl">
      <div class="text-center mb-12 no-print">
          <div class="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
              <lucide-icon name="check-circle" size="48"></lucide-icon>
          </div>
          <h1 class="text-4xl font-extrabold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p class="text-slate-500">Your trip is officially booked. Your PNR is <span class="font-bold text-primary">{{ booking?.pnrNumber || '...' }}</span></p>
      </div>

      @for (passenger of booking?.passengers; track passenger?.passengerId) {

        <!-- Classic Airline Boarding Pass -->
        <div class="print-area mb-8 rounded-2xl overflow-hidden shadow-2xl"
             [ngClass]="{'hidden': printingPassengerId !== null && printingPassengerId !== passenger?.passengerId}">

          <!-- Header Bar (primary color) -->
          <div class="bg-primary flex items-center justify-between px-6 py-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-secondary">
                <lucide-icon name="plane" class="text-secondary w-6 h-6"></lucide-icon>
              </div>
              <span class="text-white text-2xl font-extrabold tracking-wide">{{ flight?.airlineName || 'SkyReserve' }}</span>
            </div>
            <div class="flex items-center gap-8">
              <div class="text-right">
                <p class="text-white/50 text-[10px] uppercase tracking-widest">Boarding Pass</p>
                <p class="text-secondary font-extrabold text-lg italic">{{ booking?.classType }}</p>
              </div>
              <!-- Right stub header (visual repeat for the stub column) -->
              <div class="border-l border-white/20 pl-8 text-right hidden md:block">
                <p class="text-white/50 text-[10px] uppercase tracking-widest">Boarding Pass</p>
                <p class="text-secondary font-extrabold text-lg italic">{{ booking?.classType }}</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="bg-white flex flex-row min-h-[200px]">

            <!-- Barcode strip on the far left -->
            <div class="flex flex-col justify-center items-center px-3 py-5 bg-slate-50 border-r border-slate-100">
              <div class="flex flex-col gap-[2px] mb-2">
                @for (b of barcodeLines; track $index) {
                  <div class="bg-slate-500 rounded-sm" [style.height.px]="3" [style.width.px]="b"></div>
                }
              </div>
              <span class="text-[7px] text-slate-400 font-bold tracking-widest mt-1" style="writing-mode:vertical-rl; text-orientation:mixed;">{{ booking?.pnrNumber }}</span>
            </div>

            <!-- Main passenger section -->
            <div class="flex-1 p-6 relative overflow-hidden">
              <!-- Faint world-map watermark -->
              <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none text-[200px]">✈</div>

              <p class="text-[10px] text-slate-400 font-bold uppercase mb-4">Ticket {{ $index + 1 }} of {{ booking?.passengers?.length }}</p>

              <div class="grid grid-cols-3 gap-x-8 gap-y-4">
                <!-- Row 1 -->
                <div>
                  <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Passenger Name</p>
                  <p class="font-extrabold text-primary text-sm uppercase">{{ passenger?.firstName }} {{ passenger?.lastName }}</p>
                </div>
                <div>
                  <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Date</p>
                  <p class="font-extrabold text-primary text-sm">{{ flight?.departureTime | date:'ddMMM' | uppercase }}</p>
                </div>
                <div>
                  <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Time</p>
                  <p class="font-extrabold text-primary text-sm">{{ flight?.departureTime | date:'HH:mm' }}</p>
                </div>

                <!-- Row 2 -->
                <div>
                  <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">From</p>
                  <p class="font-extrabold text-primary text-sm uppercase">{{ fromCity }}</p>
                </div>
                <div>
                  <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Flight</p>
                  <p class="font-extrabold text-primary text-sm">{{ flight?.flightNumber }}</p>
                </div>
                <div>
                  <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Seat</p>
                  <p class="font-extrabold text-secondary text-2xl leading-none">{{ seatNumbers[$index] }}</p>
                </div>

                <!-- Row 3 -->
                <div>
                  <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">To</p>
                  <p class="font-extrabold text-primary text-sm uppercase">{{ toCity }}</p>
                </div>
                <div>
                  <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Gate</p>
                  <p class="font-extrabold text-primary text-2xl leading-none">B12</p>
                </div>
                <div>
                  <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Board Till</p>
                  <p class="font-extrabold text-primary text-sm">{{ flight?.departureTime | date:'HH:mm' }}</p>
                </div>
              </div>
            </div>

            <!-- Dashed tear-off notch separator -->
            <div class="flex flex-col items-center justify-between w-5 py-0 relative z-10">
              <div class="w-5 h-5 rounded-full bg-slate-100 ring-1 ring-slate-200 -translate-y-0.5"></div>
              <div class="flex-1 border-l-2 border-dashed border-slate-300"></div>
              <div class="w-5 h-5 rounded-full bg-slate-100 ring-1 ring-slate-200 translate-y-0.5"></div>
            </div>

            <!-- Right Stub -->
            <div class="w-52 p-5 bg-slate-50 flex flex-col gap-3 border-l border-dashed border-slate-200">
              <div>
                <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Passenger Name</p>
                <p class="font-extrabold text-primary text-xs uppercase leading-tight">{{ passenger?.firstName }} {{ passenger?.lastName }}</p>
              </div>
              <div>
                <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">From</p>
                <p class="font-extrabold text-primary text-sm uppercase">{{ fromCity }}</p>
              </div>
              <div>
                <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">To</p>
                <p class="font-extrabold text-primary text-sm uppercase">{{ toCity }}</p>
              </div>

              <div class="grid grid-cols-3 gap-1">
                <div>
                  <p class="text-[8px] text-slate-400 uppercase font-bold">Date</p>
                  <p class="font-bold text-primary text-[10px]">{{ flight?.departureTime | date:'ddMMM' | uppercase }}</p>
                </div>
                <div>
                  <p class="text-[8px] text-slate-400 uppercase font-bold">Time</p>
                  <p class="font-bold text-primary text-[10px]">{{ flight?.departureTime | date:'HH:mm' }}</p>
                </div>
                <div>
                  <p class="text-[8px] text-slate-400 uppercase font-bold">Flight</p>
                  <p class="font-bold text-primary text-[10px]">{{ flight?.flightNumber }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-1">
                <div>
                  <p class="text-[8px] text-slate-400 uppercase font-bold">Seat</p>
                  <p class="font-bold text-secondary text-base">{{ seatNumbers[$index] }}</p>
                </div>
                <div>
                  <p class="text-[8px] text-slate-400 uppercase font-bold">Gate</p>
                  <p class="font-bold text-primary text-base">B12</p>
                </div>
              </div>

              <!-- QR code -->
              <img [src]="getQrCodeUrl(passenger)" class="w-20 h-20 mx-auto border border-slate-200 p-1 bg-white rounded mt-auto" alt="QR">

              <!-- Plane icon circle (like reference image) -->
              <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto">
                <lucide-icon name="plane" class="text-secondary w-5 h-5"></lucide-icon>
              </div>

              <!-- Print / Email -->
              <div class="flex gap-2 no-print">
                <button (click)="printTicket(passenger?.passengerId)"
                  class="flex-1 bg-primary text-white py-2 rounded-lg font-bold flex items-center justify-center gap-1 text-xs hover:bg-slate-800 transition-all">
                  <lucide-icon name="printer" class="w-3 h-3"></lucide-icon> Print
                </button>
                <button (click)="emailTicket(passenger)"
                  class="flex-1 bg-secondary text-white py-2 rounded-lg font-bold flex items-center justify-center gap-1 text-xs hover:opacity-90 transition-all">
                  <lucide-icon name="mail" class="w-3 h-3"></lucide-icon> Email
                </button>
              </div>
            </div>

          </div>
        </div>
      }

      <div class="flex gap-4 mt-8 no-print">
          <button (click)="print()" class="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
              <lucide-icon name="printer" class="w-4 h-4"></lucide-icon> Print All
          </button>
          <button routerLink="/" class="bg-white text-slate-700 px-8 py-3 rounded-xl border font-bold hover:bg-slate-50 transition-all">Go Home</button>
      </div>
    </div>
  `
})
export class ConfirmationComponent implements OnInit {
  @Input() bookingId!: string;
  booking: any;
  flight: any;
  passenger: any;
  printingPassengerId: number | null = null;
  seatNumbers: string[] = [];
  fromCity: string = '';
  toCity: string = '';
  barcodeLines: number[] = [];

  bookingService = inject(BookingService);
  flightService = inject(FlightService);
  passengerService = inject(PassengerService);
  router = inject(Router);

  ngOnInit() {
    this.generateBarcodeLines();
    this.bookingService.getBookingById(Number(this.bookingId)).subscribe({
      next: (b) => {
        this.booking = b;
        this.loadRelatedData();
      },
      error: () => this.router.navigate(['/'])
    });
  }

  loadRelatedData() {
    if (!this.booking) return;
    this.flight = this.flightService.getFlightById(this.booking.flightId);
    this.resolveCityNames();
    this.generateSeatNumbers();

    if (!this.booking.passengers && this.booking.passengerId) {
      this.passengerService.getPassengerById(this.booking.passengerId).subscribe(p => {
        this.booking.passengers = [p];
        this.generateSeatNumbers();
      });
    }
  }

  resolveCityNames() {
    if (!this.flight) return;
    const airports = this.flightService.availableAirports();
    const cities = this.flightService.availableCities();

    const originAirport = airports.find((a: any) => a.airportId === this.flight.originAirportId);
    const destAirport = airports.find((a: any) => a.airportId === this.flight.destAirportId);

    const originCity = cities.find((c: any) => c.cityId === originAirport?.cityId);
    const destCity = cities.find((c: any) => c.cityId === destAirport?.cityId);

    this.fromCity = originCity?.cityName || this.flight.fromCode || 'Departure';
    this.toCity = destCity?.cityName || this.flight.toCode || 'Destination';
  }

  generateSeatNumbers() {
    const count = this.booking?.passengers?.length || 1;
    const baseRow = Math.floor(Math.random() * 40) + 1;
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    this.seatNumbers = Array.from({ length: count }, (_, i) => {
      const col = cols[i % cols.length];
      const row = baseRow + Math.floor(i / cols.length);
      return `${row}${col}`;
    });
  }

  generateBarcodeLines() {
    // Simulate realistic barcode widths
    this.barcodeLines = Array.from({ length: 30 }, () =>
      [16, 24, 28, 32, 36, 40][Math.floor(Math.random() * 6)]
    );
  }

  getQrCodeUrl(p: any): string {
    if (!this.booking || !this.flight || !p) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PNR:${this.booking.pnrNumber}|FLIGHT:${this.flight?.flightNumber}|PASSENGER:${p.lastName}`;
  }

  printTicket(passengerId: number) {
    this.printingPassengerId = passengerId;
    setTimeout(() => {
      window.print();
      this.printingPassengerId = null;
    }, 100);
  }

  emailTicket(passenger: any) {
    if (!passenger || !passenger.email) {
      alert('Passenger email not provided.');
      return;
    }
    const subject = `Your SkyReserve Boarding Pass - Flight ${this.flight?.flightNumber}`;
    const body = `Hello ${passenger.firstName} ${passenger.lastName},\n\nYour flight is confirmed!\n\nBooking Reference (PNR): ${this.booking?.pnrNumber}\nFlight: ${this.flight?.airlineName} ${this.flight?.flightNumber}\nRoute: ${this.fromCity} to ${this.toCity}\nClass: ${this.booking?.classType}\nPassenger: ${passenger.firstName} ${passenger.lastName}\nPassport: ${passenger.passportNo}\nSeat: ${this.seatNumbers[0]}\nGate: B12\n\nHave a safe flight with SkyReserve!`;
    const mailtoLink = `mailto:${passenger.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }

  print() {
    this.printingPassengerId = null;
    setTimeout(() => window.print(), 50);
  }
}
