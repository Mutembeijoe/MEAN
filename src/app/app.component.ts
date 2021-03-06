import { Component } from '@angular/core';
import { Post } from './interfaces/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  storedPosts: Post[] = [];
  title = 'mean-course';

  onAddPost(post: Post) {
    this.storedPosts.push(post);
  }
}
