import { Component, inject, computed, effect, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../services/auth.service';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { DocumentActionsService } from '../../../services/document-actions.service';
import { DocumentStatus } from '../../../models/document.model';

@Component({
  selector: 'app-document-filters',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './document-filters.component.html',
  styleUrls: ['./document-filters.component.scss']
})
export class DocumentFiltersComponent {
  allStatuses = Object.values(DocumentStatus);

  private readonly authService = inject(AuthService);
  private readonly documentActions = inject(DocumentActionsService);
  readonly state = inject(DashboardStateService);
  
  isReviewer = computed(() => this.authService.isReviewer());
  statusFilter = computed(() => this.state.statusFilter());
  creatorFilter = computed(() => this.state.creatorFilter());
  uniqueCreators = computed(() => this.state.uniqueCreators());
  isProcessing = computed(() => this.documentActions.isProcessing());
  
  readonly updateCreatorsEffect = effect(() => {
    if (!this.state.isLoading()) {
      this.state.updateUniqueCreators();
    }
  });
  
  onStatusFilterChange(status: DocumentStatus | ''): void {
    this.state.setStatusFilter(status);
  }
  
  onCreatorFilterChange(creator: string): void {
    this.state.setCreatorFilter(creator);
  }
  
  addDocument(): void {
    this.documentActions.addDocument();
  }
} 