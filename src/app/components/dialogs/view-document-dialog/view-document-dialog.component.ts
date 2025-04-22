import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Document } from '../../../models/document.model';
import { PdfViewerComponent } from '../../../pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-view-document-dialog',
  standalone: true,
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

  constructor(
    private dialogRef: MatDialogRef<ViewDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { document: Document }
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }
} 