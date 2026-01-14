import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post-service';
import { Post } from '../../models/post';

@Component({
  selector: 'app-post-page',
  imports: [CommonModule],
  templateUrl: './post-page.html',
  styleUrl: './post-page.css',
})
export class PostPage implements OnInit {
  post: Post | null = null;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.post = this.postService.getSelectedPost();
  }
}
