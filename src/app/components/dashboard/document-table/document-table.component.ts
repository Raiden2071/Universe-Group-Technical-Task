import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AuthService } from '../../../services/auth.service';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { DocumentActionsService } from '../../../services/document-actions.service';
import { DocumentActionsComponent } from '../document-actions/document-actions.component';

@Component({
  selector: 'app-document-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    DocumentActionsComponent
  ],
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.scss']
})
export class DocumentTableComponent {
  private readonly authService = inject(AuthService);
  readonly state = inject(DashboardStateService);
  readonly actions = inject(DocumentActionsService);
  
  // Состояние таблицы через сигналы
  isLoading = computed(() => this.state.isLoading());
  isProcessingAction = computed(() => this.actions.isProcessing());
  actionError = computed(() => this.actions.actionError());
  hasDocuments = computed(() => this.state.paginatedDocuments().length > 0);
  totalDocumentsCount = computed(() => this.state.totalDocumentsCount());
  pageSize = computed(() => this.state.pageSize());
  
  displayedColumns = computed(() => 
    this.authService.isReviewer() 
      ? ['name', 'status', 'createdBy', 'updatedAt', 'actions'] 
      : ['name', 'status', 'updatedAt', 'actions']
  );
  
  handlePageEvent(event: PageEvent): void {
    this.state.handlePageEvent(event);
  }
  
  handleSort(sort: Sort): void {
    this.state.handleSort(sort);
  }
} 