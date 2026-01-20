import { Component, inject } from '@angular/core';
import { FormControl, FormsModule , Validators} from '@angular/forms';
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
  readonly email = new FormControl('',[Validators.required, Validators.email]);
  readonly title = new FormControl('',[Validators.required, Validators.minLength(5)]);
  readonly body = new FormControl('',[Validators.required, Validators.minLength(10)]);

  titleErrorMessage = signal('');
  bodyErrorMessage = signal('');
  emailErrorMessage = signal('');

  constructor() {
    merge(this.email.statusChanges, 
      this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailMessage());
    merge(this.title.statusChanges, 
      this.title.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateTitleMessage());
    merge(this.body.statusChanges, 
      this.body.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateBodyMessage());
  }
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

  updateEmailMessage() {
    if (this.email.hasError('required')) {
      this.emailErrorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }
  updateBodyMessage() {
    if (this.body.hasError('required')) {
      this.bodyErrorMessage.set('You must enter a value');
    } else if (this.body.hasError('minlength')) {
      this.bodyErrorMessage.set('Body must be at least 10 characters long');
    } else {
      this.bodyErrorMessage.set('');
    }
  }
  updateTitleMessage() {
    if (this.title.hasError('required')) {
      this.titleErrorMessage.set('You must enter a value');
    } else if (this.title.hasError('minlength')) {
      this.titleErrorMessage.set('Title must be at least 5 characters long');
    } else {
      this.titleErrorMessage.set('');
    }
  }
}
