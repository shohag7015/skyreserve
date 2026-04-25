import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';
import { BookingService } from '../../core/services/booking.service';
import { LucideAngularModule } from 'lucide-angular';
import { Payment } from '../../core/models/payment.model';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="container mx-auto px-6 py-12 max-w-4xl">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-black text-slate-900 mb-4 tracking-tight">Complete Your Payment</h1>
        <p class="text-slate-500 text-lg">Secure your booking by choosing a payment method below.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Payment Options -->
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
              <lucide-icon name="credit-card" class="w-6 h-6 text-primary"></lucide-icon>
              Payment Method
            </h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button 
                (click)="selectedMethod = 'CREDIT_CARD'" 
                [class.selected-method]="selectedMethod === 'CREDIT_CARD'"
                class="method-card">
                <div class="flex items-center gap-3">
                  <lucide-icon name="credit-card" class="w-5 h-5"></lucide-icon>
                  <span>Credit / Debit Card</span>
                </div>
                <div class="w-4 h-4 border-2 rounded-full flex items-center justify-center" [class.bg-primary]="selectedMethod === 'CREDIT_CARD'">
                  @if (selectedMethod === 'CREDIT_CARD') { <div class="w-1.5 h-1.5 bg-white rounded-full"></div> }
                </div>
              </button>

              <button 
                (click)="selectedMethod = 'PAYPAL'" 
                [class.selected-method]="selectedMethod === 'PAYPAL'"
                class="method-card">
                <div class="flex items-center gap-3">
                  <lucide-icon name="wallet" class="w-5 h-5"></lucide-icon>
                  <span>PayPal / Wallet</span>
                </div>
                <div class="w-4 h-4 border-2 rounded-full flex items-center justify-center" [class.bg-primary]="selectedMethod === 'PAYPAL'">
                  @if (selectedMethod === 'PAYPAL') { <div class="w-1.5 h-1.5 bg-white rounded-full"></div> }
                </div>
              </button>
            </div>

            @if (selectedMethod === 'CREDIT_CARD') {
              <div class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-600">Card Number</label>
                  <input type="text" placeholder="xxxx xxxx xxxx xxxx" class="input-field">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-semibold text-slate-600">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" class="input-field">
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-semibold text-slate-600">CVV</label>
                    <input type="password" placeholder="***" class="input-field">
                  </div>
                </div>
              </div>
            } @else {
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <lucide-icon name="info" class="w-8 h-8 text-blue-500"></lucide-icon>
                <p class="text-blue-700 text-sm">You will be redirected to PayPal's secure portal to complete your transaction.</p>
              </div>
            }
          </div>

          <button 
            (click)="processPayment()" 
            [disabled]="isProcessing()"
            class="w-full bg-primary text-white py-5 rounded-3xl font-bold text-xl transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/10">
            @if (isProcessing()) {
              <span class="flex items-center justify-center gap-2">
                <lucide-icon name="loader-2" class="w-6 h-6 animate-spin"></lucide-icon>
                Processing...
              </span>
            } @else {
              Pay and Confirm
            }
          </button>
        </div>

        <!-- Order Summary -->
        <div class="space-y-6">
          <div class="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl">
            <h3 class="font-bold text-xl mb-6">Order Summary</h3>
            @if (booking) {
              <div class="space-y-4 text-slate-400">
                <div class="flex justify-between border-b border-slate-800 pb-4 mb-4">
                  <span>Booking ID</span>
                  <span class="text-white font-mono">#{{ booking.bookingId }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Base Fare</span>
                  <span class="text-white">$ {{ (booking.totalFare / 1.15).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Taxes (15%)</span>
                  <span class="text-white">$ {{ (booking.totalFare - (booking.totalFare / 1.15)).toFixed(2) }}</span>
                </div>
                <div class="pt-6 border-t border-slate-800 flex justify-between items-center">
                  <span class="text-lg font-bold text-white uppercase tracking-wider">Total</span>
                  <span class="text-3xl font-black text-secondary">$ {{ booking.totalFare }}</span>
                </div>
              </div>
            } @else {
              <div class="animate-pulse space-y-4">
                <div class="h-4 bg-slate-800 rounded w-3/4"></div>
                <div class="h-4 bg-slate-800 rounded w-1/2"></div>
                <div class="h-10 bg-slate-800 rounded mt-8"></div>
              </div>
            }
          </div>
          
          <div class="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
              <lucide-icon name="shield-check" class="w-6 h-6"></lucide-icon>
            </div>
            <div>
              <p class="font-bold text-slate-900 text-sm">Secure Payment</p>
              <p class="text-slate-500 text-xs">Your data is protected by industry-standard encryption.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .method-card {
      @apply flex items-center justify-between p-5 border-2 rounded-2xl transition-all duration-300;
      border-color: #f1f5f9;
    }
    .method-card:hover {
      @apply border-primary/20 bg-slate-50;
    }
    .selected-method {
      @apply border-primary bg-slate-50;
    }
    .input-field {
      @apply w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 transition-all duration-200;
    }
    .input-field:focus {
      @apply outline-none border-primary ring-4 ring-primary/5 bg-white;
    }
  `]
})
export class PaymentComponent implements OnInit {
    bookingId = 0;
    booking: any;
    selectedMethod = 'CREDIT_CARD';
    isProcessing = signal(false);

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private paymentService = inject(PaymentService);
    private bookingService = inject(BookingService);

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.bookingId = +params['bookingId'];
            this.loadBooking();
        });
    }

    loadBooking() {
        // We assume there's a getBookingById in bookingService
        this.bookingService.getBookingById(this.bookingId).subscribe({
            next: (res) => {
                this.booking = res;
            },
            error: () => {
                this.router.navigate(['/']);
            }
        });
    }

    processPayment() {
        if (!this.booking) return;

        this.isProcessing.set(true);

        const paymentData: Payment = {
            bookingId: this.bookingId,
            amount: this.booking.totalFare,
            paymentMethod: this.selectedMethod,
            paymentStatus: 'SUCCESS' // Simulation
        };

        // Simulate network delay
        setTimeout(() => {
            this.paymentService.processPayment(paymentData).subscribe({
                next: (res) => {
                    this.isProcessing.set(false);
                    this.router.navigate(['/confirmation', this.bookingId]);
                },
                error: (err) => {
                    this.isProcessing.set(false);
                    alert('Payment Failed. Please try again.');
                }
            });
        }, 2000);
    }
}
