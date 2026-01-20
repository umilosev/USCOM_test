import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogConfig, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../models/post';


@Component({
  selector: 'app-delete-post-dialog',
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './delete-post-dialog.html',
  styleUrl: './delete-post-dialog.css',
})
export class DeletePostDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public post: Post,
    private dialogRef: MatDialogRef<DeletePostDialog>,
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
