import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
  private readonly authService = inject(AuthService);
  
  currentUser = computed(() => this.authService.currentUser());
  
  logout(): void {
    this.authService.logout();
  }
} 