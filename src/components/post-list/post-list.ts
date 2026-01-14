import { Component } from '@angular/core';
import { PostService } from '../../services/post-service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList {
  posts$: Observable<any[]>;

  constructor(private postService: PostService) {
    this.posts$ = this.postService.getPosts();
  }
}
