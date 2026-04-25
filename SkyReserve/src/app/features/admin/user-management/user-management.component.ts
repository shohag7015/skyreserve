import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/flight.model';
import { LucideAngularModule } from 'lucide-angular';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">User <span class="text-secondary">Management</span></h1>
          <p class="text-slate-500 mt-2 font-medium">Manage and view all registered system users.</p>
        </div>
      </div>

      <div class="bg-white/70 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">User Details</th>
              <th class="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</th>
              <th class="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Phone</th>
              <th class="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
              <th class="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (user of users(); track user.id) {
              <tr class="group hover:bg-slate-50/50 transition-colors">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black">
                        {{ user.name.substring(0,2).toUpperCase() }}
                    </div>
                    <div class="flex flex-col">
                        <span class="font-bold text-slate-900">{{ user.name }}</span>
                        <span class="text-[10px] text-slate-400 uppercase tracking-widest font-black">ID: #{{ user.id }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6 font-medium text-slate-600">
                  {{ user.email }}
                </td>
                <td class="px-8 py-6 font-medium text-slate-600">
                  {{ user.phoneNumber || 'N/A' }}
                </td>
                <td class="px-8 py-6">
                  <span [class]="user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'" 
                        class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-8 py-6 text-right">
                    <button (click)="deleteUser(user.id)" class="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete User">
                        <lucide-icon name="trash-2" class="w-5 h-5"></lucide-icon>
                    </button>
                    <button class="p-2 text-slate-400 hover:text-primary transition-colors">
                        <lucide-icon name="more-horizontal" class="w-5 h-5"></lucide-icon>
                    </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class UserManagementComponent implements OnInit {
  users = signal<User[]>([]);
  private userService = inject(UserService);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users.set(data);
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
