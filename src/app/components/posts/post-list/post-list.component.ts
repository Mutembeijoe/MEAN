import { PostService } from './../../../services/post.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/interfaces/post';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSubscription: Subscription | null = null;

  constructor(private postsS: PostService) {}

  ngOnInit() {
    this.postsSubscription = this.postsS.getPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  onDelete(postId: string) {
    this.postsS.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSubscription?.unsubscribe();
  }
}
