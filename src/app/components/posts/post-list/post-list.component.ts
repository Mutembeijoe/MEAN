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
    // this.posts = this.postsS.getPosts();
    this.postsSubscription = this.postsS.postSubcription.subscribe((posts) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postsSubscription?.unsubscribe();
  }
}
