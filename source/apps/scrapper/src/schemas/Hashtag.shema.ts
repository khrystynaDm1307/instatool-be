import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Post } from './Post.shema';

@Entity()
export class Hashtag {
  @PrimaryColumn()
  id: string;

  @ManyToMany(() => Post, (post) => post.hashtags, {
    cascade: true,
  })
  @JoinTable()
  posts: Post[];

}
