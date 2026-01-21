import { Component, inject } from '@angular/core';
import { FormControl, FormGroup , Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Comment } from '../../../models/comment';
import { Post } from '../../../models/post';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-comment-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit-comment-dialog.html',
  styleUrl: './edit-comment-dialog.css',
})
export class EditCommentDialog {
  private dialogRef = inject(MatDialogRef<EditCommentDialog>);
  private comment = inject<Comment | null>(MAT_DIALOG_DATA);

  commentForm = new FormGroup({
    email: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    name: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    body: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],  
    }),
  });

    constructor() {
    if (this.comment) {
      this.commentForm.patchValue({
        name: this.comment.name,
        body: this.comment.body,
        email: this.comment.email,
      });
    }
  }

  save(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    const comment: Comment = {
      postId: this.comment?.postId ?? 2,
      id: this.comment?.id ?? 501,
      ...this.commentForm.getRawValue(),
    };

    this.dialogRef.close(comment);
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
}
