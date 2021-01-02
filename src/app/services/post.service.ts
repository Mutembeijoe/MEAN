import { Post } from './../interfaces/post';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private onPostUpdated = new Subject<Post[]>();

  get postSubcription() {
    return this.onPostUpdated.asObservable();
  }

  addPost(title: string, content: string): void {
    this.posts.push({ title, content });
    this.onPostUpdated.next([...this.posts]);
  }

  getPosts(): Post[] {
    return [...this.posts];
  }
}
