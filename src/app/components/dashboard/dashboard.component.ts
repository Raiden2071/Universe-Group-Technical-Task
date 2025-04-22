import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardStateService } from '../../services/dashboard-state.service';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DocumentFiltersComponent } from './document-filters/document-filters.component';
import { DocumentTableComponent } from './document-table/document-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
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

  ngOnInit(): void {
    this.dashboardState.loadDocuments();
  }
} 