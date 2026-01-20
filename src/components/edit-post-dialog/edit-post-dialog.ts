import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../models/post';
import { inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-post-dialog',
  imports: [],
  templateUrl: './edit-post-dialog.html',
  styleUrl: './edit-post-dialog.css',
})
export class EditPostDialog {
  private dialogRef = inject(MatDialogRef<EditPostDialog>);
  private data = inject<Post | null>(MAT_DIALOG_DATA);

  postForm = new FormGroup({
    email: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    title: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    body: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],  
    }),
  });

  constructor() {
    if (this.data) {
      this.postForm.patchValue({
        title: this.data.title,
        body: this.data.body,
        email: this.data.email,
      });
    }
  }

  save(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const post: Post = {
      userId: this.data?.userId ?? 2,
      id: this.data?.id ?? 101,
      ...this.postForm.getRawValue(),
    };

    this.dialogRef.close(post);
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
}

