import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';
import { DocumentActionsService } from '../../../services/document-actions.service';
import { Document, DocumentStatus } from '../../../models/document.model';

@Component({
  selector: 'app-document-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './document-actions.component.html',
  styleUrls: ['./document-actions.component.scss']
})
export class DocumentActionsComponent {
  @Input({ required: true }) document!: Document;
  
  DocumentStatus = DocumentStatus;
  
  private readonly authService = inject(AuthService);
  private readonly documentActions = inject(DocumentActionsService);
  private readonly snackBar = inject(MatSnackBar);
  
  isReviewer = computed(() => this.authService.isReviewer());
  
  viewDocument(): void {
    this.documentActions.viewDocument(this.document);
  }
  
  editDocument(): void {
    this.documentActions.editDocument(this.document);
  }
  
  updateStatus(newStatus: DocumentStatus): void {
    this.documentActions.updateStatus(this.document, newStatus).subscribe({
      next: () => {
        this.snackBar.open(`Document status updated to ${newStatus}`, 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(`Error updating status: ${err.message}`, 'Close', { duration: 5000 });
      }
    });
  }
  
  recallDocument(): void {
    this.documentActions.recallDocument(this.document);
  }
  
  deleteDocument(): void {
    this.documentActions.deleteDocument(this.document);
  }
  
  canDelete(): boolean {
    return this.documentActions.canDelete(this.document);
  }
  
  canRecall(): boolean {
    return this.documentActions.canRecall(this.document);
  }
  
  canEdit(): boolean {
    return this.documentActions.canEdit(this.document);
  }
} 