import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  apiPostsUrl = 'https://jsonplaceholder.typicode.com/posts';

  private selectedPostSubject = new BehaviorSubject<Post | null>(null);
  selectedPost$ = this.selectedPostSubject.asObservable();

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

  setSelectedPost(post: Post) {
    this.selectedPostSubject.next(post);
  }

  getSelectedPost(): Post | null {
    return this.selectedPostSubject.value;
  }

  getPostComments(postId: number): Observable<any[]> {
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

  
}