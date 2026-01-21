import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post-service';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { MatDialog } from '@angular/material/dialog';
import { EditPostDialog } from '../dialog/edit-post-dialog/edit-post-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-page',
  imports: [CommonModule],
  templateUrl: './post-page.html',
  styleUrl: './post-page.css',
})
export class PostPage implements OnInit {
  post: Post | null = null;
  comments: Comment[] | null = null;
  commentsLoading: boolean = false;
  postLoading: boolean = false;


  constructor(
    private postService: PostService, 
    private route: ActivatedRoute, 
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    // Subscribe to selected post
    this.postService.selectedPost$.subscribe(post => {
      this.post = post;
      this.cdr.detectChanges(); // force Angular to update the template
    });

    // Also subscribe to route params to fetch a new post if needed
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (!id) return;

      // Check if current selected post matches id
      if (!this.post || this.post.id !== id) {
        this.postLoading = true;
        this.postService.getPostById(id).subscribe(post => {
          this.postService.setSelectedPost(post); // automatically updates subscription
          this.postLoading = false;
          this.loadComments(post.id);
        });
      } else if (!this.comments) {
        this.loadComments(id);
      }
    });
  }


  private loadComments(postId: number) {
    this.commentsLoading = true;
    this.postService.getPostComments(postId).subscribe({
      next: (comments) => {
        console.log('Comments received for post', postId, ':', comments);
        this.comments = comments;
        this.commentsLoading = false;
        console.log('Comments loaded, loading set to false');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.commentsLoading = false;
        this.comments = [];
      }
    });
  }

  public editPost(): void {
    const dialogRef = this.dialog.open(EditPostDialog, {
      width: '400px',
      data: this.post,
    });

    dialogRef.afterClosed().subscribe((editedPost: Post | null) => {
      if (!editedPost) {
        this.snackBar.open('Post editing cancelled!', 'Close', { duration: 2000 });
        return;
      }

      this.postService.editPost(editedPost).subscribe({
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

  public editPostFromTable(post: Post) {
    this.post = this.postService.getSelectedPost();
  }
}
