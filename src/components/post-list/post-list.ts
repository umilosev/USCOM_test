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

  constructor(private postService: PostService, private router: Router) {
    this.posts$ = this.postService.getPosts();
  }

  // Initialize the component and the data source for the table
  ngOnInit() {
    this.posts$.subscribe(posts => {
      this.dataSource.data = posts;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  //routes to post page that we clicked
  onRowClick(post: Post) {
    console.log('Clicked post:', post);
    this.postService.setSelectedPost(post);
    this.router.navigate([`/posts/${post.id}`]);
  }
}
