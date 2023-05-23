import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Post } from './Post.shema';

@Entity()
export class TaggedUser {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  profile_pic_url: string;

  @Column({ nullable: true })
  is_verified: boolean;

  @ManyToMany(() => Post,(post) => post.tagged_users, {
    cascade: true,
  })
  @JoinTable()
  posts: Post[]
}
