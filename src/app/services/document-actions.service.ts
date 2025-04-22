import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, finalize } from 'rxjs';

import { DocumentService } from './document.service';
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
  private readonly destroyRef = inject(DestroyRef, { optional: true });
  
  private processingAction = signal<boolean>(false);
  private lastActionError = signal<string | null>(null);
  
  isProcessing = this.processingAction.asReadonly();
  actionError = this.lastActionError.asReadonly();

  addDocument(): void {
    const dialogRef = this.dialog.open(AddDocumentDialogComponent);
    
    let afterClosed$ = dialogRef.afterClosed();
    
    if (this.destroyRef) {
      afterClosed$ = afterClosed$.pipe(takeUntilDestroyed(this.destroyRef));
    }
    
    afterClosed$.subscribe(result => {
      if (result) {
        this.processingAction.set(true);
        this.lastActionError.set(null);
        
        let addDocument$ = this.documentService.addDocument(
          result.name,
          result.file,
          result.saveAsDraft ? DocumentStatus.Draft : DocumentStatus.PendingReview
        ).pipe(
          finalize(() => this.processingAction.set(false))
        );
        
        if (this.destroyRef) {
          addDocument$ = addDocument$.pipe(takeUntilDestroyed(this.destroyRef));
        }
        
        addDocument$.subscribe({
          next: () => {
            this.snackBar.open('Document added successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.lastActionError.set(err.message);
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
    
    let afterClosed$ = dialogRef.afterClosed();
    
    if (this.destroyRef) {
      afterClosed$ = afterClosed$.pipe(takeUntilDestroyed(this.destroyRef));
    }
    
    afterClosed$.subscribe(result => {
      if (result) {
        this.processingAction.set(true);
        this.lastActionError.set(null);
        
        let updateDocument$ = this.documentService.updateDocument(
          document.id, 
          { name: result.name }
        ).pipe(
          finalize(() => this.processingAction.set(false))
        );
        
        if (this.destroyRef) {
          updateDocument$ = updateDocument$.pipe(takeUntilDestroyed(this.destroyRef));
        }
        
        updateDocument$.subscribe({
          next: () => {
            this.snackBar.open('Document updated successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.lastActionError.set(err.message);
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
    this.processingAction.set(true);
    this.lastActionError.set(null);
    
    return this.documentService.updateDocument(document.id, { status: newStatus }).pipe(
      finalize(() => this.processingAction.set(false))
    );
  }
  
  recallDocument(document: Document): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Recall Document', 
        message: 'Are you sure you want to recall this document?' 
      }
    });
    
    let afterClosed$ = dialogRef.afterClosed();
    
    if (this.destroyRef) {
      afterClosed$ = afterClosed$.pipe(takeUntilDestroyed(this.destroyRef));
    }
    
    afterClosed$.subscribe(result => {
      if (result) {
        this.processingAction.set(true);
        this.lastActionError.set(null);
        
        let recallDocument$ = this.documentService.recallDocument(document.id).pipe(
          finalize(() => this.processingAction.set(false))
        );
        
        if (this.destroyRef) {
          recallDocument$ = recallDocument$.pipe(takeUntilDestroyed(this.destroyRef));
        }
        
        recallDocument$.subscribe({
          next: () => {
            this.snackBar.open('Document recalled successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.lastActionError.set(err.message);
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
    
    let afterClosed$ = dialogRef.afterClosed();
    
    if (this.destroyRef) {
      afterClosed$ = afterClosed$.pipe(takeUntilDestroyed(this.destroyRef));
    }
    
    afterClosed$.subscribe(result => {
      if (result) {
        this.processingAction.set(true);
        this.lastActionError.set(null);
        
        let deleteDocument$ = this.documentService.deleteDocument(document.id).pipe(
          finalize(() => this.processingAction.set(false))
        );
        
        if (this.destroyRef) {
          deleteDocument$ = deleteDocument$.pipe(takeUntilDestroyed(this.destroyRef));
        }
        
        deleteDocument$.subscribe({
          next: () => {
            this.snackBar.open('Document deleted successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.lastActionError.set(err.message);
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