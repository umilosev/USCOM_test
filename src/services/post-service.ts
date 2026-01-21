import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../models/post';
import { Comment } from '../models/comment';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  apiPostsUrl = 'https://jsonplaceholder.typicode.com/posts';

  private selectedPostSubject = new BehaviorSubject<Post | null>(null);
  selectedPost$ = this.selectedPostSubject.asObservable();
  public cachedPostsSubject = new BehaviorSubject<Post[]>([]);
  public cachedPosts$ = this.cachedPostsSubject.asObservable();


  //returns all posts
  getPosts(): Observable<Post[]> {
    if (this.cachedPostsSubject.value.length > 0) {
      // Return cached posts as an observable
      return from([this.cachedPostsSubject.value]);
    }

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
        throw error;
      }),
      // Cache the fetched posts
      tap((posts: Post[]) => {
        this.cachedPostsSubject.next(posts);
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
    if (this.cachedPostsSubject.value.length > 0) {
        const filtered = this.cachedPostsSubject.value.filter(post => post.userId === userId);
        return from([filtered]);
      } 
      // Otherwise, fetch posts first
      return this.getPosts().pipe(
        tap(() => {
          return this.cachedPostsSubject.value.filter(post => post.userId === userId);
        })
      );

  }
  // POST / PUT / DELETE methods for posts
  addPost(post: Post): Observable<Post> {
    return from(
      fetch(this.apiPostsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(error => {
        console.error('Error creating post:', error);
        throw error;
      })
    );
  }

  editPost(post: Post): Observable<Post> {
    const url = `${this.apiPostsUrl}/${post.id}`;

    return from(
      fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      tap(updatedPost => {
        const posts = this.cachedPostsSubject.value;
        const index = posts.findIndex(p => p.id === updatedPost.id);

        if (index !== -1) {
          const updatedPosts = [...posts];
          updatedPosts[index] = updatedPost;
          this.cachedPostsSubject.next(
            this.cachedPostsSubject.value.map(p =>
                p.id === updatedPost.id ? updatedPost : p
              )
          );
        }
      })
    );
  }


  deletePost(postId: number): Observable<void> {
    this.cachedPostsSubject.next(this.cachedPostsSubject.value.filter(post => post.id !== postId));
    const url = `${this.apiPostsUrl}/${postId}`;
    return from(
      fetch(url, {
        method: 'DELETE',
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
      })
    ).pipe(
      catchError(error => {
        console.error('Error deleting post:', error);
        throw error;
      })
    );
  }

  // POST / PUT / DELETE methods for comments
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

  editComment(comment: Comment): Observable<Comment> {
    const url = '${this.apiPostsUrl}/comments/${comment.id}';
    return from(
      fetch(url, {
        method:'PUT',
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
        console.error('Error editing comment:', error);
        throw error;
      })
    );
  }

  deleteComment(commentId: number): Observable<void> {
    const url = `${this.apiPostsUrl}/comments/${commentId}`;
    return from(
      fetch(url, {
        method: 'DELETE',
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
      })
    ).pipe(
      catchError(error => {
        console.error('Error deleting comment:', error);
        throw error;
      })
    );
  }

  updatePostInCache(updatedPost: Post) {
    const updated = this.cachedPostsSubject.value.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    );

    this.cachedPostsSubject.next(updated);

    if (this.selectedPostSubject.value?.id === updatedPost.id) {
      this.selectedPostSubject.next(updatedPost);
    }
  }

}