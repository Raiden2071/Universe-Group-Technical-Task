import { Injectable, computed, signal, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { DocumentService } from './document.service';
import { Document, DocumentStatus } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  pageSize = signal<number>(5);
  pageIndex = signal<number>(0);
  
  sortField = signal<string>('updatedAt');
  sortDirection = signal<'asc' | 'desc'>('desc');
  
  statusFilter = signal<DocumentStatus | ''>('');
  creatorFilter = signal<string>('');
  
  uniqueCreators = signal<string[]>([]);
  
  private readonly documentService = inject(DocumentService);
  
  isLoading = computed(() => this.documentService.isLoading());
  
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
  
  constructor() { }
  
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
  
  setStatusFilter(status: DocumentStatus | ''): void {
    this.statusFilter.set(status);
    this.pageIndex.set(0);
  }
  
  setCreatorFilter(creator: string): void {
    this.creatorFilter.set(creator);
    this.pageIndex.set(0);
  }
  
  updateUniqueCreators(): void {
    const documents = this.documentService.documents();
    const creators = [...new Set(documents.map(doc => doc.createdBy))];
    this.uniqueCreators.set(creators);
  }
  
  loadDocuments(): void {
    this.documentService.loadDocuments();
    this.updateUniqueCreators();
  }
} 