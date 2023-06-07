import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostOwner } from './PostOwner.shema';

class ColumnIntNumberTransformer {
  public to(data: number): number {
    return data;
  }

  public from(data: string): number {
    if (!Boolean(data)) return 0;

    return parseInt(data);
  }
}

@Entity()
export class ProfileStatistic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  followersCount: number;

  @Column({
    nullable: true,
    type: 'bigint',
    transformer: new ColumnIntNumberTransformer(),
  })
  engagement: number;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @Column({ nullable: true })
  videoPlayCount: number;

  @Column({ nullable: true })
  videoViewCount: number;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => PostOwner, (owner) => owner.statistic)
  owner: PostOwner;
}
