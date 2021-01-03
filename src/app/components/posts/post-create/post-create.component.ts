import { PostService } from './../../../services/post.service';
import { Post } from './../../../interfaces/post';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private mode: Mode = Mode.create;
  private postId: string | null = null;
  post: Post | undefined;
  isLoading: boolean = false;
  form: FormGroup | undefined;

  constructor(private postsS: PostService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(7),
      ]),
      content: new FormControl(null, [Validators.required]),
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('postId')) {
        this.mode = Mode.edit;
        this.postId = params.get('postId');
        this.isLoading = true;
        this.postsS.getPost(this.postId!).subscribe((result) => {
          this.post = {
            id: result._id,
            title: result.title,
            content: result.content,
          };
          this.form?.setValue({
            title: this.post.title,
            content: this.post.content,
          });
          this.isLoading = false;
        });
      } else {
        this.mode = Mode.create;
        this.postId = null;
      }
    });
  }

  onNoteSubmitted() {
    if (this.form?.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode == Mode.create) {
      this.postsS.addPost(this.form?.value.title, this.form?.value.content);
    } else {
      this.postsS.updatePost(
        this.postId!,
        this.form?.value.title,
        this.form?.value.content
      );
    }
    this.form?.reset();
  }

  get title() {
    return this.form?.get('title');
  }
  get content() {
    return this.form?.get('content');
  }
}

enum Mode {
  create,
  edit,
}
