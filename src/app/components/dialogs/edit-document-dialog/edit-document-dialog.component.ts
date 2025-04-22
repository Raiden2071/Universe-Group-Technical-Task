import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Document } from '../../../models/document.model';

@Component({
  selector: 'app-edit-document-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-document-dialog.component.html',
  styleUrls: ['./edit-document-dialog.component.scss']
})
export class EditDocumentDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditDocumentDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as { document: Document };
  
  form: FormGroup;
  
  constructor() {
    this.form = this.fb.group({
      name: [this.data.document.name, [Validators.required]]
    });
  }
  
  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        name: this.form.get('name')?.value
      });
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
} 