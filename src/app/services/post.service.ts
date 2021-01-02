import { Post } from './../interfaces/post';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private onPostUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  addPost(title: string, content: string): void {
    const post: Post = { id: '', title, content };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((result) => {
        console.log(result.message);
        this.posts.push(post);
        this.onPostUpdated.next([...this.posts]);
      });
  }

  getPosts() {
    this.http
      .get<{ posts: Post[] }>('http://localhost:3000/api/posts')
      .subscribe((result) => {
        this.posts = result.posts;
        this.onPostUpdated.next([...this.posts]);
      });

    return this.onPostUpdated.asObservable();
  }
}
