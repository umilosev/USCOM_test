import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../models/post';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  apiPostsUrl = 'https://jsonplaceholder.typicode.com/posts';

  private selectedPostSubject = new BehaviorSubject<Post | null>(null);
  selectedPost$ = this.selectedPostSubject.asObservable();

  //returns all posts
  getPosts(): Observable<Post[]> {
    return from(
      fetch(this.apiPostsUrl).then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(error => {
        console.error('Error fetching posts:', error);
        throw error; // Re-throw to let subscribers handle
      })
    );
  }

  //sets that is passed to be the selected post
  setSelectedPost(post: Post) {
    this.selectedPostSubject.next(post);
  }

  //returns the selected post
  getSelectedPost(): Post | null {
    return this.selectedPostSubject.value;
  }

  //fetches a post by its id
  getPostById(postId: number): Observable<Post> {
    const url = `${this.apiPostsUrl}/${postId}`;
    return from(
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(error => {
        console.error('Error fetching post:', error);
        throw error;
      })
    );
  }

  //fetches comments for a specific post
  getPostComments(postId: number): Observable<Comment[]> {
    const url = `${this.apiPostsUrl}/${postId}/comments`;
    return from(
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(error => {
        console.error('Error fetching post comments:', error);
        throw error;
      })
    );
  }

  //filters posts by userId
  //TODO : implement a different way of filteting
  //which combines a single search box and local filter based on that single field
  //instead of making a new API call for each filter
  //we would filter locally based on the cached posts data
  filterPostsByUser(userId: number): Observable<Post[]> {
    const url = `${this.apiPostsUrl}?userId=${userId}`;
    return from(
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(error => {
        console.error('Error fetching filtered posts:', error);
        throw error;
      })
    );
  }

  addCommentToPost(postId: number, comment: Comment): Observable<Comment> {
    const url = `${this.apiPostsUrl}/${postId}/comments`;
    return from(
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(error => {
        console.error('Error adding comment to post:', error);
        throw error;
      })
    );
  }
}