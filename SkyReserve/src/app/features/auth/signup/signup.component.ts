import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-signup',
  // ... (template remains same)
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl shadow-primary/5 border border-slate-100">
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-blue-50 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <lucide-icon name="user-plus" size="32"></lucide-icon>
          </div>
          <h1 class="text-3xl font-black text-primary">Create Account</h1>
          <p class="text-slate-400 mt-2">Join us to start your journey</p>
        </div>

        <div *ngIf="errorMessage()" class="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-shake">
          {{ errorMessage() }}
        </div>

        <form (submit)="signup()" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
            <div class="relative">
              <input [(ngModel)]="name" name="name" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all pl-10" placeholder="someone abc" required>
              <lucide-icon name="user" class="w-4 h-4 absolute left-1.5 top-2 text-slate-300"></lucide-icon>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
            <div class="relative">
              <input [(ngModel)]="phoneNumber" name="phoneNumber" type="tel" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all pl-10" placeholder="+880 1XXXXXXXXXX"required>
              <lucide-icon name="phone" class="w-4 h-4 absolute left-1.5 top-2 text-slate-300"></lucide-icon>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
            <div class="relative">
              <input [(ngModel)]="email" name="email" type="email" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all pl-10" placeholder="someone@example.com" required>
              <lucide-icon name="mail" class="w-4 h-4 absolute left-1.5 top-2 text-slate-300"></lucide-icon>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
            <div class="relative">
              <input [(ngModel)]="password" name="password" type="password" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all pl-10" placeholder="********" required>
              <lucide-icon name="lock" class="w-4 h-4 absolute left-1.5 top-2 text-slate-300"></lucide-icon>
            </div>
          </div>

          <button type="submit" [disabled]="isLoading()" class="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="isLoading()" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isLoading() ? 'Creating Account...' : 'Create Account' }}
          </button>
          
          <p class="text-center text-sm text-slate-500">
            Already have an account? <a routerLink="/auth/login" class="text-secondary font-bold hover:underline">Log in</a>
          </p>
        </form>
      </div>
    </div>
  `
})
export class SignUpComponent {
  name = '';
  phoneNumber = '';
  email = '';
  password = '';
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  signup() {
    if (this.name && this.phoneNumber && this.email && this.password) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.signup(this.name, this.email, this.phoneNumber, this.password).subscribe({
        next: () => {
          this.isLoading.set(false);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err: any) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Failed to create account. Please try again.');
        }
      });
    }
  }
}
