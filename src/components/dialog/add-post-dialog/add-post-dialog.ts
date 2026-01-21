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
import { Post } from '../../../models/post';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../services/post-service';



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

  constructor(private postService : PostService){}

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

  save(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const post: Post = {
      userId: this.data?.userId ?? 2,
      id: this.postService.cachedPostsSubject.value.length + 1,
      ...this.postForm.getRawValue(),
    };

    this.dialogRef.close(post);
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
}
