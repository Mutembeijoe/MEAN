import { PostService } from './../../../services/post.service';
import { Post } from './../../../interfaces/post';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private mode: Mode = Mode.create;
  private postId: string | null = null;
  public post: Post | null = null;
  constructor(private postsS: PostService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('postId')) {
        this.mode = Mode.edit;
        this.postId = params.get('postId');
        this.postsS.getPost(this.postId!).subscribe(
          (result) =>
            (this.post = {
              id: result._id,
              title: result.title,
              content: result.content,
            })
        );
      } else {
        this.mode = Mode.create;
        this.postId = null;
      }
    });
  }

  onNoteSubmitted(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode == Mode.create) {
      this.postsS.addPost(form.value.title, form.value.content);
    } else {
      this.postsS.updatePost(
        this.postId!,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}

enum Mode {
  create,
  edit,
}
