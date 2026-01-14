import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post-service';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';

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

  constructor(private postService: PostService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.post = this.postService.getSelectedPost();
        if (this.post && this.post.id === id) {
          // Same post, just load comments if not already loaded
          if (!this.comments && !this.commentsLoading) {
            this.loadComments(id);
          }
        } else {
          // Different post or no cached post, reset and fetch
          this.post = null;
          this.comments = null;
          this.postLoading = true;
          this.postService.getPostById(id).subscribe(post => {
            this.post = post;
            this.postService.setSelectedPost(post);
            this.postLoading = false;
            this.loadComments(post.id);
            this.cdr.detectChanges();
          });
        }
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
}
