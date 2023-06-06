import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Post } from './Post.shema';

@Entity()
export class Mention {
  @PrimaryColumn()
  id: string;

  @ManyToMany(() => Post, (post) => post.mentions, {
    cascade: true,
  })
  
  @JoinTable()
  posts: Post[];

}
