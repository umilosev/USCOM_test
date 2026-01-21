import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { PostService } from '../../services/post-service';
import { Post } from '../../models/post';
import { AddPostDialog } from '../add-post-dialog/add-post-dialog';
import { DeletePostDialog } from '../delete-post-dialog/delete-post-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList implements OnInit {
  dataSource = new MatTableDataSource<Post>([]);
  displayedColumns: string[] = ['id', 'title', 'body', 'actions'];
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private postService: PostService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.isLoading = true;

    this.postService.cachedPosts$.subscribe(posts => {
      this.dataSource.data = posts;
      this.isLoading = false;

      // paginator must be reassigned when data changes
      this.dataSource.paginator = this.paginator;
    });

    // trigger initial load
    this.postService.getPosts().subscribe();
  }


  openAddPostDialog(): void {
    const dialogRef = this.dialog.open(AddPostDialog, {
      width: '600px', // smaller width is usually fine
    });

    dialogRef.afterClosed().subscribe((post: Post | null) => {
      if (post) {
        // Call the service to actually add the post
        this.postService.addPost(post).subscribe({
          next: (newPost) => {
            this.postService.cachedPostsSubject.next([
              ...this.postService.cachedPostsSubject.value,
              newPost
            ]);

    this.snackBar.open('Post added successfully!', 'Close', { duration: 2000 });
  },
  error: () => {
    this.snackBar.open('Failed to add post!', 'Close', { duration: 2000 });
  }
});

      } else {
        // User cancelled
        this.snackBar.open('Add post cancelled.', 'Close', { duration: 2000 });
      }
    });
  }


  onRowClick(post: Post) {
    this.postService.setSelectedPost(post);
    this.router.navigate([`/posts/${post.id}`]);
  }

  openDeletePostDialog(post: Post) {
    const dialogRef = this.dialog.open(DeletePostDialog, { width: '400px', data: post });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.postService.deletePost(post.id).subscribe(() => {
          this.removePostFromTable(post.id);
        });
        this.snackBar.open('Post deleted!', 'Close', {});
      } else {
          this.snackBar.open('Post deletion cancelled!', 'Close', {});

      }
    });
  }

  removePostFromTable(postId: number) {
  // Update the dataSource.data array
  this.dataSource.data = this.dataSource.data.filter(p => p.id !== postId);

  // Optional: also update cachedPosts in your service
  this.postService.cachedPostsSubject.next(this.postService.cachedPostsSubject.value.filter(p => p.id !== postId));
  }
  
}