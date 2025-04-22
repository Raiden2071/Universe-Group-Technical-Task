import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { DocumentService } from './document.service';
import { AuthService } from './auth.service';
import { Document, DocumentStatus } from '../models/document.model';

import { AddDocumentDialogComponent } from '../components/dialogs/add-document-dialog/add-document-dialog.component';
import { EditDocumentDialogComponent } from '../components/dialogs/edit-document-dialog/edit-document-dialog.component';
import { ViewDocumentDialogComponent } from '../components/dialogs/view-document-dialog/view-document-dialog.component';
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DocumentActionsService {
  private readonly documentService = inject(DocumentService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  addDocument(): void {
    const dialogRef = this.dialog.open(AddDocumentDialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentService.addDocument(
          result.name,
          result.file,
          result.saveAsDraft ? DocumentStatus.Draft : DocumentStatus.PendingReview
        ).subscribe({
          next: () => {
            this.snackBar.open('Document added successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.snackBar.open(`Error adding document: ${err.message}`, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  editDocument(document: Document): void {
    const dialogRef = this.dialog.open(EditDocumentDialogComponent, {
      data: { document }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentService.updateDocument(document.id, { name: result.name }).subscribe({
          next: () => {
            this.snackBar.open('Document updated successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.snackBar.open(`Error updating document: ${err.message}`, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  viewDocument(document: Document): void {
    const viewDocument = {
      ...document,
      fileUrl: this.documentService.getDocumentViewUrl(document)
    };
    this.dialog.open(ViewDocumentDialogComponent, {
      data: { document: viewDocument },
      minWidth: '1000px',
      height: '600px'
    });
  }
  
  updateStatus(document: Document, newStatus: DocumentStatus): Observable<any> {
    return this.documentService.updateDocument(document.id, { status: newStatus });
  }
  
  recallDocument(document: Document): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Recall Document', 
        message: 'Are you sure you want to recall this document?' 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentService.recallDocument(document.id).subscribe({
          next: () => {
            this.snackBar.open('Document recalled successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.snackBar.open(`Error recalling document: ${err.message}`, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  deleteDocument(document: Document): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Delete Document', 
        message: 'Are you sure you want to delete this document?' 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentService.deleteDocument(document.id).subscribe({
          next: () => {
            this.snackBar.open('Document deleted successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.snackBar.open(`Error deleting document: ${err.message}`, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  canDelete(document: Document): boolean {
    return this.documentService.canDeleteDocument(document);
  }
  
  canRecall(document: Document): boolean {
    return this.documentService.canRecallDocument(document);
  }
  
  canEdit(document: Document): boolean {
    return this.documentService.canEditDocument(document);
  }
} 