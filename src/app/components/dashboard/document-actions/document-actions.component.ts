import { Component, Input, inject, computed, signal } from '@angular/core';
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
  @Input({ required: true }) set document(value: Document) {
    this.documentSignal.set(value);
  }
  
  get document(): Document {
    return this.documentSignal();
  }
  
  private documentSignal = signal<Document>({} as Document);
  
  DocumentStatus = DocumentStatus;
  
  private readonly authService = inject(AuthService);
  private readonly documentActions = inject(DocumentActionsService);
  private readonly snackBar = inject(MatSnackBar);
  
  isReviewer = computed(() => this.authService.isReviewer());
  
  canDelete = computed(() => this.documentActions.canDelete(this.documentSignal()));
  
  canRecall = computed(() => this.documentActions.canRecall(this.documentSignal()));
  
  canEdit = computed(() => this.documentActions.canEdit(this.documentSignal()));
  
  viewDocument(): void {
    this.documentActions.viewDocument(this.documentSignal());
  }
  
  editDocument(): void {
    this.documentActions.editDocument(this.documentSignal());
  }
  
  updateStatus(newStatus: DocumentStatus): void {
    this.documentActions.updateStatus(this.documentSignal(), newStatus).subscribe({
      next: () => {
        this.snackBar.open(`Document status updated to ${newStatus}`, 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(`Error updating status: ${err.message}`, 'Close', { duration: 5000 });
      }
    });
  }
  
  recallDocument(): void {
    this.documentActions.recallDocument(this.documentSignal());
  }
  
  deleteDocument(): void {
    this.documentActions.deleteDocument(this.documentSignal());
  }
} 