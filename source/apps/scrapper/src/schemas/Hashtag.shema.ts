import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Post } from './Post.shema';
import { PostOwner } from './PostOwner.shema';
import { OwnerPost } from './OwnerPost.shema';

@Entity()
export class Hashtag {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => Post, (post) => post.hashtags, {
    cascade: true,
  })
  @JoinTable()
  posts: Post[];

  @ManyToMany(() => OwnerPost, (post) => post.hashtags, {
    cascade: true,
  })
  @JoinTable()
  all_posts: OwnerPost[];
}
