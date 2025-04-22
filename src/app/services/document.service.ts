import { Injectable, Signal, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Document, DocumentStatus } from '../models/document.model';
import { AuthService } from './auth.service';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documentsSignal = signal<Document[]>([]);
  private loadingSignal = signal<boolean>(false);

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Document 1',
      fileName: 'document1.pdf',
      fileUrl: '/assets/documents/document1.pdf',
      status: DocumentStatus.Draft,
      createdBy: 'user',
      creatorId: '1',
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Document 2',
      fileName: 'document2.pdf',
      fileUrl: '/assets/documents/document2.pdf',
      status: DocumentStatus.PendingReview,
      createdBy: 'user',
      creatorId: '1',
      updatedAt: new Date('2024-01-02')
    },
    {
      id: '3',
      name: 'Document 3',
      fileName: 'document3.pdf',
      fileUrl: '/assets/documents/document3.pdf',
      status: DocumentStatus.InReview,
      createdBy: 'user',
      creatorId: '1',
      updatedAt: new Date('2024-01-03')
    },
    {
      id: '4',
      name: 'Document 4',
      fileName: 'document4.pdf',
      fileUrl: '/assets/documents/document4.pdf',
      status: DocumentStatus.Approved,
      createdBy: 'reviewer',
      creatorId: '2',
      updatedAt: new Date('2024-01-04')
    },
    {
      id: '5',
      name: 'Document 5',
      fileName: 'document5.pdf',
      fileUrl: '/assets/documents/document5.pdf',
      status: DocumentStatus.Rejected,
      createdBy: 'reviewer',
      creatorId: '2',
      updatedAt: new Date('2024-01-05')
    }
  ];

  get documents(): Signal<Document[]> {
    return this.documentsSignal.asReadonly();
  }

  get isLoading(): Signal<boolean> {
    return this.loadingSignal.asReadonly();
  }

  getFilteredDocuments(status?: DocumentStatus, creator?: string): Signal<Document[]> {
    return computed(() => {
      const currentUser = this.authService.currentUser();
      const documents = this.documentsSignal();
      
      if (!currentUser) return [];

      let filtered = [...documents];

      if (currentUser.role === UserRole.USER) {
        filtered = filtered.filter(doc => doc.creatorId === currentUser.id);
      } else if (currentUser.role === UserRole.REVIEWER) {
        filtered = filtered.filter(doc => doc.status !== DocumentStatus.Draft);
      }

      if (status) {
        filtered = filtered.filter(doc => doc.status === status);
      }

      if (creator) {
        filtered = filtered.filter(doc => doc.createdBy === creator);
      }

      return filtered;
    });
  }

  loadDocuments(): void {
    this.loadingSignal.set(true);
    setTimeout(() => {
      this.documentsSignal.set(this.mockDocuments);
      this.loadingSignal.set(false);
    }, 500);
  }

  getDocument(id: string): Observable<Document | undefined> {
    const document = this.mockDocuments.find(doc => doc.id === id);
    return of(document).pipe(delay(300));
  }

  addDocument(name: string, file: File, status: DocumentStatus): Observable<Document> {
    const currentUser = this.authService.currentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const newDoc: Document = {
      id: (this.mockDocuments.length + 1).toString(),
      name,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      status,
      createdBy: currentUser.username,
      creatorId: currentUser.id,
      updatedAt: new Date()
    };

    this.mockDocuments = [...this.mockDocuments, newDoc];
    this.documentsSignal.update(docs => [...docs, newDoc]);

    return of(newDoc).pipe(delay(500));
  }

  updateDocument(id: string, updates: Partial<Document>): Observable<Document> {
    const index = this.mockDocuments.findIndex(doc => doc.id === id);
    
    if (index === -1) {
      throw new Error('Document not found');
    }

    const updatedDoc = {
      ...this.mockDocuments[index],
      ...updates,
      updatedAt: new Date()
    };

    this.mockDocuments = [
      ...this.mockDocuments.slice(0, index),
      updatedDoc,
      ...this.mockDocuments.slice(index + 1)
    ];
    
    this.documentsSignal.set(this.mockDocuments);

    return of(updatedDoc).pipe(delay(500));
  }

  deleteDocument(id: string): Observable<boolean> {
    const index = this.mockDocuments.findIndex(doc => doc.id === id);
    
    if (index === -1) {
      return of(false);
    }

    this.mockDocuments = [
      ...this.mockDocuments.slice(0, index),
      ...this.mockDocuments.slice(index + 1)
    ];
    
    this.documentsSignal.set(this.mockDocuments);

    return of(true).pipe(delay(500));
  }

  recallDocument(id: string): Observable<Document> {
    return this.updateDocument(id, { status: DocumentStatus.Recalled });
  }

  canDeleteDocument(document: Document): boolean {
    return [DocumentStatus.Draft, DocumentStatus.Recalled].includes(document.status);
  }

  canRecallDocument(document: Document): boolean {
    return document.status === DocumentStatus.PendingReview;
  }

  canEditDocument(document: Document): boolean {
    return document.status === DocumentStatus.Draft;
  }
} 