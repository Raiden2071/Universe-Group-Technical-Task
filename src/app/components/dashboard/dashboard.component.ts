import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../services/auth.service';
import { DocumentService } from '../../services/document.service';
import { Document, DocumentStatus } from '../../models/document.model';
import { User, UserRole } from '../../models/user.model';
import { AddDocumentDialogComponent } from '../dialogs/add-document-dialog/add-document-dialog.component';
import { EditDocumentDialogComponent } from '../dialogs/edit-document-dialog/edit-document-dialog.component';
import { ViewDocumentDialogComponent } from '../dialogs/view-document-dialog/view-document-dialog.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pageSize = signal<number>(5);
  pageIndex = signal<number>(0);
  
  sortField = signal<string>('updatedAt');
  sortDirection = signal<'asc' | 'desc'>('desc');
  
  statusFilter = signal<DocumentStatus | ''>('');
  creatorFilter = signal<string>('');
  
  DocumentStatus = DocumentStatus;
  
  displayedColumns = computed(() => 
    this.isReviewer() ? ['name', 'status', 'createdBy', 'updatedAt', 'actions'] : 
                      ['name', 'status', 'updatedAt', 'actions']
  );
  
  allStatuses = Object.values(DocumentStatus);
  uniqueCreators = signal<string[]>([]);
  
  isLoading = computed(() => this.documentService.isLoading());
  currentUser = computed(() => this.authService.currentUser());
  isReviewer = computed(() => this.authService.isReviewer());
  
  filteredDocuments = computed<Document[]>(() => 
    this.documentService.getFilteredDocuments(
      this.statusFilter() || undefined, 
      this.creatorFilter() || undefined
    )()
  );
  
  sortedDocuments = computed<Document[]>(() => {
    const docs = this.filteredDocuments();
    if (!this.sortField()) return docs;
    
    return [...docs].sort((a, b) => {
      const aValue = a[this.sortField() as keyof Document];
      const bValue = b[this.sortField() as keyof Document];
      
      let comparison = 0;
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
      
      return this.sortDirection() === 'desc' ? comparison * -1 : comparison;
    });
  });
  
  paginatedDocuments = computed<Document[]>(() => {
    const sortedDocs = this.sortedDocuments();
    const startIndex = this.pageIndex() * this.pageSize();
    return sortedDocs.slice(startIndex, startIndex + this.pageSize());
  });
  
  totalDocumentsCount = computed<number>(() => this.filteredDocuments().length);
  
  private readonly authService = inject(AuthService);
  private readonly documentService = inject(DocumentService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.documentService.loadDocuments();
    this.updateUniqueCreators();
  }
  
  handlePageEvent(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }
  
  handleSort(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortField.set('updatedAt');
      this.sortDirection.set('desc');
      return;
    }
    
    this.sortField.set(sort.active);
    this.sortDirection.set(sort.direction as 'asc' | 'desc');
  }
  
  onStatusFilterChange(status: DocumentStatus | ''): void {
    this.statusFilter.set(status);
    this.pageIndex.set(0);
  }
  
  onCreatorFilterChange(creator: string): void {
    this.creatorFilter.set(creator);
    this.pageIndex.set(0);
  }
  
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
            this.updateUniqueCreators();
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
  
  updateStatus(document: Document, newStatus: DocumentStatus): void {
    this.documentService.updateDocument(document.id, { status: newStatus }).subscribe({
      next: () => {
        this.snackBar.open(`Document status updated to ${newStatus}`, 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(`Error updating status: ${err.message}`, 'Close', { duration: 5000 });
      }
    });
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
  
  logout(): void {
    this.authService.logout();
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
  
  private updateUniqueCreators(): void {
    const docs = this.documentService.documents();
    const creators = [...new Set(docs.map(doc => doc.createdBy))];
    this.uniqueCreators.set(creators);
  }
} 