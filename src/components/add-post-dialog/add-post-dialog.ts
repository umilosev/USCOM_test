import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule , Validators} from '@angular/forms';
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
import { Post } from '../../models/post';
import { PostService } from '../../services/post-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';



@Component({
  selector: 'app-add-post-dialog',
  standalone: true,
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
  templateUrl: './add-post-dialog.html',
  styleUrl: './add-post-dialog.css',
})
export class AddPostDialog {
  
  private dialogRef = inject(MatDialogRef<AddPostDialog>);
  private data = inject<Post | null>(MAT_DIALOG_DATA);
  private postService = inject(PostService);
  private snackBar = inject(MatSnackBar);

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
  titleErrorMessage = signal('');
  bodyErrorMessage = signal('');
  emailErrorMessage = signal('');

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
