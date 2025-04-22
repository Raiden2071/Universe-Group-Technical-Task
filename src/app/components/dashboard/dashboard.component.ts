import { Component, OnInit, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardStateService } from '../../services/dashboard-state.service';
import { DocumentActionsService } from '../../services/document-actions.service';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DocumentFiltersComponent } from './document-filters/document-filters.component';
import { DocumentTableComponent } from './document-table/document-table.component';

@Component({
  selector: 'app-dashboard',
  
  imports: [
    CommonModule,
    DashboardHeaderComponent,
    DocumentFiltersComponent,
    DocumentTableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly dashboardState = inject(DashboardStateService);
  private readonly documentActions = inject(DocumentActionsService);
  
  isLoading = computed(() => this.dashboardState.isLoading());
  isProcessing = computed(() => this.documentActions.isProcessing());
  
  readonly updateCreatorsEffect = effect(() => {
    if (!this.isLoading()) {
      this.dashboardState.updateUniqueCreators();
    }
  });

  ngOnInit(): void {
    this.dashboardState.loadDocuments();
  }
} 