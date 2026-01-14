import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { PostService } from '../../services/post-service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Post } from '../../models/post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList implements OnInit {

  dataSource = new MatTableDataSource<Post>([]);
  displayedColumns: string[] = ['id', 'title', 'body'];
  posts$: Observable<Post[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private postService: PostService) {
    this.posts$ = this.postService.getPosts();
  }

  ngOnInit() {
    this.posts$.subscribe(posts => {
      this.dataSource.data = posts;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  onRowClick(post: Post) {
    console.log('Clicked post:', post);
    // TODO click logic navigation to specific post and display its page
  }
}
