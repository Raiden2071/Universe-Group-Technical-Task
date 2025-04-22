import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-document-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './add-document-dialog.component.html',
  styleUrls: ['./add-document-dialog.component.scss']
})
export class AddDocumentDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddDocumentDialogComponent>);
  
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    saveAsDraft: [false]
  });
  
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      
      if (!this.form.get('name')?.value) {
        const fileName = this.selectedFile.name.split('.').slice(0, -1).join('.');
        this.form.get('name')?.setValue(fileName);
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid && this.selectedFile) {
      this.dialogRef.close({
        name: this.form.get('name')?.value,
        file: this.selectedFile,
        saveAsDraft: this.form.get('saveAsDraft')?.value
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 