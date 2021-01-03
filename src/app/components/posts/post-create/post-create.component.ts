import { PostService } from './../../../services/post.service';
import { Post } from './../../../interfaces/post';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mimeType.validators';

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
  imagePreview: string | null | ArrayBuffer = '';

  constructor(private postsS: PostService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(7),
      ]),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
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

  get title() {
    return this.form?.get('title');
  }
  get content() {
    return this.form?.get('content');
  }
  get image() {
    return this.form?.get('image');
  }

  onNoteSubmitted() {
    if (this.form?.invalid) {
      console.error(this.form);
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

  onImagePicked(e: Event) {
    const file: File = (e.target as HTMLInputElement).files![0];
    this.form?.patchValue({ image: file });
    this.form?.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }
}

enum Mode {
  create,
  edit,
}
