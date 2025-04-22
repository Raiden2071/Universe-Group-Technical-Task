export enum DocumentStatus {
  Draft = 'Draft',
  PendingReview = 'Pending Review',
  InReview = 'In Review',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Recalled = 'Recalled'
}

export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  status: DocumentStatus;
  createdBy: string;
  creatorId: string;
  updatedAt: Date;
} 