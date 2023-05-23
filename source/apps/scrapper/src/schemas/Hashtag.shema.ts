import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Post } from './Post.shema';

@Entity()
export class Hashtag {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => Post, (post) => post.hashtags, {
    cascade: true,
  })
  @JoinTable()
  posts: Post[];
}
