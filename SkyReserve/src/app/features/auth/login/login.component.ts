import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink],
  template: `    <div class="min-h-[80vh] flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl shadow-primary/5 border border-slate-100">
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-blue-50 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <lucide-icon name="user" size="32"></lucide-icon>
          </div>
          <h1 class="text-3xl font-black text-primary">Welcome Back</h1>
          <p class="text-slate-400 mt-2">Sign in to manage your travels</p>
        </div>

        <div *ngIf="errorMessage()" class="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-shake">
          {{ errorMessage() }}
        </div>

        <form (submit)="login()" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
            <div class="relative">
              <input [(ngModel)]="email" name="email" type="email" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all pl-10" placeholder="someone@example.com" required>
              <lucide-icon name="mail" class="w-4 h-4 absolute left-1.5 top-2 text-slate-300"></lucide-icon>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" class="text-xs font-bold text-secondary hover:underline">Forgot Password?</a>
              </div>
              <div class="relative">
                <input [(ngModel)]="password" name="password" type="password" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all pl-10" placeholder="********" required>
                <lucide-icon name="lock" class="w-4 h-4 absolute left-1.5 top-2 text-slate-300"></lucide-icon>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input type="checkbox" id="rememberMe" [(ngModel)]="rememberMe" name="rememberMe" class="w-4 h-4 rounded text-secondary focus:ring-secondary border-slate-200">
              <label for="rememberMe" class="text-sm text-slate-500 font-medium cursor-pointer">Remember me for 30 days</label>
            </div>
          </div>

          <button type="submit" [disabled]="isLoading()" class="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="isLoading()" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isLoading() ? 'Signing in...' : 'Continue' }}
          </button>
          
          <div class="relative py-4">
             <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
             <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-4 text-slate-400 font-bold">Or continue with</span></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button type="button" class="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-600">
              <lucide-icon name="github" class="w-5 h-5"></lucide-icon>
              Google
            </button>
            <button type="button" class="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-600">
              <lucide-icon name="facebook" class="w-5 h-5"></lucide-icon>
              Facebook
            </button>
          </div>

          <p class="text-center text-sm text-slate-500 pt-4">
            Don't have an account? <a routerLink="/auth/signup" class="text-secondary font-bold hover:underline">Sign up for free</a>
          </p>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  login() {
    if (this.email && this.password) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.isLoading.set(false);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err: any) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Invalid email or password');
        }
      });
    }
  }
}
