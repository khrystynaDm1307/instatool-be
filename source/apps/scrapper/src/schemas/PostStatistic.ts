import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OwnerPost } from './OwnerPost.shema';

@Entity()
export class PostStatistic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @Column({ default: 0, nullable: true })
  videoPlayCount: number;

  @Column({ default: 0, nullable: true })
  videoViewCount: number;

  @Column({ default: 0 })
  engagement: number;

  @Column({ default: 0.0, type: 'decimal' })
  engagement_rate: number;

  @ManyToOne(() => OwnerPost, (post) => post.statics)
  post: OwnerPost;
}
