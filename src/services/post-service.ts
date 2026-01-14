import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  apiPostsUrl = 'https://jsonplaceholder.typicode.com/posts';

  getPosts(): Observable<any[]> {
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
}

