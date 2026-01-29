import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post-service';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { MatDialog } from '@angular/material/dialog';
import { EditPostDialog } from '../dialog/edit-post-dialog/edit-post-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddCommentDialog } from '../dialog/add-comment-dialog/add-comment-dialog';
import { EditCommentDialog } from '../dialog/edit-comment-dialog/edit-comment-dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-post-page',
  imports: [
    CommonModule,
    MatCard,
    MatDivider,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatList,
    MatListItem,
  ],
  templateUrl: './post-page.html',
  styleUrl: './post-page.css',
})
export class PostPage implements OnInit {
  post: Post | null = null;
  comments: Comment[] = [];
  commentsLoading: boolean = false;
  postLoading: boolean = false;


  constructor(
    private postService: PostService, 
    private route: ActivatedRoute, 
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  //
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (!id) return;

      this.postLoading = true;
      this.commentsLoading = true;
      this.post = null;
      this.comments = [];

      this.postService.getPostById(id).subscribe({
        next: post => {
          this.post = post;
          this.postService.setSelectedPost(post);
          this.postLoading = false;

          // Subscribe to comments BehaviorSubject for this post
          this.postService.getComments$(post.id).subscribe(comments => {
            this.comments = comments;
            this.commentsLoading = false;
            this.cdr.detectChanges();
          });

          // Trigger fetch if needed
          this.postService.loadComments(post.id);
        },
        error: () => {
          this.postLoading = false;
          this.post = null;
          this.commentsLoading = false;
        }
      });
    });
  }

  public editPost(): void {
    const dialogRef = this.dialog.open(EditPostDialog, {
      width: '1700px',
      data: this.post,
    });

    dialogRef.afterClosed().subscribe((editedPost: Post | null) => {
      if (!editedPost) {
        this.snackBar.open('Post editing cancelled!', 'Close', { duration: 2000 });
        return;
      }
      this.postService.editPost(editedPost).subscribe({
        //we use the response in savedPost to update the cache
        //because we trust the backend to return the updated post
        next: (savedPost) => {
          // Update the service cache
          this.postService.updatePostInCache(savedPost); // this updates cachedPosts AND selectedPost$
          this.snackBar.open('Post edited!', 'Close', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('Failed to edit post!', 'Close', { duration: 2000 });
        }
      });
    });
  }

  public openAddCommentDialog(): void {
    const dialogRef = this.dialog.open(AddCommentDialog, {
      width: '400px',
      data: this.post,
    });
    dialogRef.afterClosed().subscribe((newComment: Comment | null) => {
      if (!newComment) {
        this.snackBar.open('Comment adding cancelled!', 'Close', { duration: 2000 });
        return;
      }
        this.postService.addCommentToPost(this.post?.id || 0, newComment).subscribe({
          //it's the same as newPost in AddPostDialog since the API doesn't return the created comment with the ID
          next: (addedComment) => {
            this.postService.addCommentToCache(this.post?.id || 0,newComment);
            this.snackBar.open('Comment added!', 'Close', { duration: 2000 });
          },
          error: () => {
            this.snackBar.open('Failed to add comment!', 'Close', { duration: 2000 });
          }
        }); 
    });
  }

  public openEditCommentDialog(comment : Comment): void{
    const dialogRef = this.dialog.open(EditCommentDialog, {
      width: '400px',
      data: comment,
    });
    dialogRef.afterClosed().subscribe((editedComment: Comment | null) => {
      if (!editedComment) {
        this.snackBar.open('Comment editing cancelled!', 'Close', { duration: 2000 });
        return;
      }
      this.postService.editComment(editedComment).subscribe({
        next: (editedComment) => {
          this.postService.updateCommentInCache(this.post?.id || 0, editedComment); // this updates cachedComments AND selectedPost$
          this.snackBar.open('Comment edited!', 'Close', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('Failed to edit comment! because there is no backend for this', 'Close', { duration: 2000 });
        }
      });
      this.postService.updateCommentInCache(this.post?.id || 0, editedComment); // this updates cachedComments AND selectedPost$
    });
  }
}