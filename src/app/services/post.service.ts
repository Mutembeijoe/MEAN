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

  addPost(title: string, content: string, file: File): void {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', file, title);
    this.http
      .post<{ message: string; post: Post }>(this.url, formData)
      .subscribe(({ post }) => {
        const createdPost: Post = {
          id: post.id,
          title,
          content,
          imagePath: post.imagePath,
        };
        this.posts.push(createdPost);
        this.onPostUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(
    postId: string,
    title: string,
    content: string,
    imagePath: string | File
  ): void {
    let postData;

    if (typeof imagePath == 'string') {
      const post: Post = { id: postId, title, content, imagePath };
      postData = post;
    } else {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', imagePath, title);
    }

    this.http
      .put<{ message: string; post: Post }>(this.url + postId, postData)
      .subscribe((result) => {
        const post: Post = {
          id: postId,
          title,
          content,
          imagePath: result.post.imagePath,
        };
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
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
            };
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
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(this.url + postId);
  }
}
