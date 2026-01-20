import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { PostService } from '../../services/post-service';
import { Post } from '../../models/post';
import { AddPostDialog } from '../add-post-dialog/add-post-dialog';
import { DeletePostDialog } from '../delete-post-dialog/delete-post-dialog';

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
    private dialog: MatDialog

  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.postService.getPosts().subscribe({
      next: posts => {
        this.dataSource.data = posts;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openAddPostDialog(): void {
    this.dialog.open(AddPostDialog, {
      width: '1700px',
    });
  }

  onRowClick(post: Post) {
    this.postService.setSelectedPost(post);
    this.router.navigate([`/posts/${post.id}`]);
  }

  openDeletePostDialog(post: Post) {
    this.dialog.open(DeletePostDialog,{
      width: '400px',
      data: post
    });
  }
}