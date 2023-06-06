import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Post } from './Post.shema';
import { OwnerPost } from './OwnerPost.shema';

@Entity()
export class Mention {
  @PrimaryColumn()
  username: string;

  @ManyToMany(() => Post, (post) => post.mentions, {
    cascade: true,
  })
  
  @JoinTable()
  posts: Post[];

  @ManyToMany(() => OwnerPost, (post) => post.mentions, {
    cascade: true,
  })
  
  @JoinTable()
  all_posts: OwnerPost[];
}
