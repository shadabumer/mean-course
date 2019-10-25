import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdate = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPost() {
    this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => { // transforming the data so that _id becomes just id.
        return postData.posts.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id // converting _id to id
          };
        });
      }))
      .subscribe( (transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdate.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdate.asObservable();
  }

  addPost( title: string, content: string) {
    const post: Post = { id: null, title, content };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe( (responseData) => {
      const postId = responseData.postId;
      this.posts.push(post);  // updating the post locally
      this.postsUpdate.next([...this.posts]);
    });
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe( () => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdate.next([...this.posts]);
      });
  }

}
