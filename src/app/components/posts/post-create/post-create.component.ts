import { Post } from './../../../interfaces/post';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated = new EventEmitter<Post>();
  onNoteSubmitted(form: NgForm) {
    console.log('CALLLED');
    if (form.invalid) {
      return;
    }

    let post: Post = { title: form.value.title, content: form.value.content };
    this.postCreated.emit(post);
  }
}
