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
  ],
  templateUrl: './add-post-dialog.html',
  styleUrl: './add-post-dialog.css',
})
export class AddPostDialog {
  private dialogRef = inject(MatDialogRef<AddPostDialog>);
  private data = inject<Post | null>(MAT_DIALOG_DATA);
  private postService = inject(PostService);

  post: Post = this.data
    ? { ...this.data }
    : { userId: 0, id: 0, title: '', email: '',body: '' };

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
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
