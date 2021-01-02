import { PostService } from './../../../services/post.service';
import { Post } from './../../../interfaces/post';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  constructor(private postsS: PostService) {}

  onNoteSubmitted(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsS.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
