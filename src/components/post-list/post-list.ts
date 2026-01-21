import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { PostService } from '../../services/post-service';
import { Post } from '../../models/post';
import { AddPostDialog } from '../dialog/add-post-dialog/add-post-dialog';
import { DeletePostDialog } from '../dialog/delete-post-dialog/delete-post-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSort,
    MatSortModule,
    MatLabel,
    MatCard,
  ],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList implements OnInit {
  dataSource = new MatTableDataSource<Post>([]);
  displayedColumns: string[] = ['id', 'title', 'body', 'actions'];
  isLoading = true;

  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private postService: PostService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.isLoading = true;

    // Subscribe to cached posts
    this.postService.cachedPosts$.subscribe(posts => {
      this.applyFilter(this.searchQuery, posts);
      this.isLoading = false;
    });

    // Trigger initial load
    this.postService.getPosts().subscribe();

    // Handle search with debounce
    this.searchSubject.pipe(
      debounceTime(300) // wait 300ms after the last keystroke
    ).subscribe(query => {
      this.searchQuery = query;
      const posts = this.postService.cachedPostsSubject.value;
      this.applyFilter(query, posts);
    });
  }

  onSearchInput(event: any) {
    this.searchSubject.next(event.target.value);
  }

  private applyFilter(query: string, posts: Post[]) {
    if (!query) {
      this.dataSource.data = [...posts]; // create a new array reference
    } else {
      const lowerQuery = query.toLowerCase();
      this.dataSource.data = posts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.body.toLowerCase().includes(lowerQuery)
      );
    }

    // reset paginator to first page on filter
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  openAddPostDialog(): void {
    const dialogRef = this.dialog.open(AddPostDialog, {
      width: '600px', // smaller width is usually fine
    });

    dialogRef.afterClosed().subscribe((post: Post | null) => {
      if (post) {
        console.log(`New post id: ${post.id}`);
        // Call the service to actually add the post
        this.postService.addPost(post).subscribe({
          next: (newPost) => {
            this.postService.cachedPostsSubject.next([
              ...this.postService.cachedPostsSubject.value,
              //We are using post insted of newPost since the response from API doesn't give us the proper ID
              //Since we are using JSONPlaceholder API, which doesn't actually create a new response
              post
            ]);
    this.snackBar.open('Post added successfully!', 'Close', { duration: 2000 });
    }, error: () => {
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