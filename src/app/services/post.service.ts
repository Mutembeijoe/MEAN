import { Post } from './../interfaces/post';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private onPostUpdated = new Subject<Post[]>();
  private url: string = 'http://localhost:3000/api/posts/';

  constructor(private http: HttpClient, private router: Router) {}

  addPost(title: string, content: string): void {
    const post: Post = { id: '', title, content };
    this.http
      .post<{ message: string; postId: string }>(this.url, post)
      .subscribe((result) => {
        post.id = result.postId;
        this.posts.push(post);
        this.onPostUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, title: string, content: string): void {
    const post: Post = { id: postId, title, content };
    this.http
      .put<{ message: string }>(this.url + postId, post)
      .subscribe((result) => {
        const updatePosts = [...this.posts];
        const oldPostIndex = updatePosts.findIndex((post) => post.id == postId);
        updatePosts[oldPostIndex] = post;
        this.posts = updatePosts;
        this.onPostUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getPosts() {
    this.http
      .get<{ posts: any }>(this.url)
      .pipe(
        map((result) => {
          return result.posts.map((post: any) => {
            return { id: post._id, title: post.title, content: post.content };
          });
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.onPostUpdated.next([...this.posts]);
      });

    return this.onPostUpdated.asObservable();
  }

  deletePost(postId: string) {
    this.http.delete(this.url + postId).subscribe(
      (result) => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.onPostUpdated.next([...this.posts]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      this.url + postId
    );
  }
}
