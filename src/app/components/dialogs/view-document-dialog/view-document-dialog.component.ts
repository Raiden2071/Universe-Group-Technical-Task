import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Document } from '../../../models/document.model';
import { PdfViewerComponent } from '../../../pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-view-document-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    PdfViewerComponent,
  ],
  templateUrl: './view-document-dialog.component.html',
  styleUrls: ['./view-document-dialog.component.scss']
})
export class ViewDocumentDialogComponent implements OnInit {
  loading = false;
  private readonly dialogRef = inject(MatDialogRef<ViewDocumentDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as { document: Document };

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }
} 