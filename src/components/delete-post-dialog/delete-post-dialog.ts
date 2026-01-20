import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogConfig, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../models/post';
import { inject } from '@angular/core';
import { PostService } from '../../services/post-service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-delete-post-dialog',
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './delete-post-dialog.html',
  styleUrl: './delete-post-dialog.css',
})
export class DeletePostDialog {
  private snackBar = inject(MatSnackBar);
  constructor(
    @Inject(MAT_DIALOG_DATA) public post: Post,
    private dialogRef: MatDialogRef<DeletePostDialog>,
    private postService: PostService
  ) {}

  onConfirm() {
    this.postService.deletePost(this.post.id).subscribe({
      next: () => {
        console.log(`Post with id ${this.post.id} deleted successfully.`);
        this.dialogRef.close('confirmed'); // close after deletion
      },
      error: (error) => {
        console.error('Error deleting post:', error);
      }
    });
    this.snackBar.open('Post deleted successfully!', 'Close');
  }

  onCancel() {
    this.dialogRef.close();
        this.snackBar.open('Cancelled!', 'Close');

  }
}
