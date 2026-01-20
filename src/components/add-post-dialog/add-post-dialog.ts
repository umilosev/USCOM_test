import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-add-post-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
  ],
  templateUrl: './add-post-dialog.html',
  styleUrl: './add-post-dialog.css',
})
export class AddPostDialog {
  private dialogRef = inject(MatDialogRef<AddPostDialog>);
  private data = inject<Post | null>(MAT_DIALOG_DATA);
  private postService = inject(PostService);
  private snackBar = inject(MatSnackBar);


  post: Post = this.data
    ? { ...this.data }
    : { userId: 2, id: 101, title: '', email: '', body: '' };

  save(): void {
    this.postService.addPost(this.post).subscribe({
      next: (createdPost) => {
        console.log('Post created successfully:', createdPost);
        this.dialogRef.close(createdPost);
      },
      error: (error) => {
        console.error('Failed to create post:', error);
      }
    });
    this.snackBar.open('Post added successfully!', 'Close', {
      duration: 3000,
    });
  }

  cancel(): void {
    this.dialogRef.close();
    this.snackBar.open('Cancelled!', 'Close', {
      duration: 3000,
    });
  }
}
