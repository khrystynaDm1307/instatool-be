import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from './Post.shema';
import { ProfileStatistic } from './ProfileStatistic.shema';

class ColumnIntNumberTransformer {
  public to(data: number): number {
    return data;
  }

  public from(data: string): number {
    if (!data===null) return null;

    return parseInt(data);
  }
}

@Entity()
export class PostOwner {
  @PrimaryColumn()
  ownerUsername: string;

  @Column({ nullable: true })
  ownerFullName: string;

  @Column({ nullable: true })
  ownerId: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  biography: string;

  @Column({ nullable: true })
  externalUrl: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  followersCount: number;

  @Column({ nullable: true })
  followsCount: number;

  @Column({ nullable: true })
  hasChannel: boolean;

  @Column({ nullable: true })
  highlightReelCount: number;

  @Column({ nullable: true })
  isBusinessAccount: boolean;

  @Column({ nullable: true, default: false })
  gcs_picture: boolean;

  @Column({ nullable: true })
  joinedRecently: boolean;

  @Column({ nullable: true })
  businessCategoryName: string;

  @Column({ nullable: true })
  private: boolean;

  @Column({ nullable: true })
  verified: boolean;

  @Column({ nullable: true })
  profilePicUrl: string;

  @Column({ nullable: true })
  profilePicUrlHD: string;

  @Column({ nullable: true })
  igtvVideoCount: number;

  @Column({ nullable: true })
  postsCount: number;

  @Column({
    nullable: true,
    type: 'bigint',
    transformer: new ColumnIntNumberTransformer(),
  })
  engagement: number;

  @Column({ nullable: true, default: false })
  updated: boolean;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Post, (post) => post.owner, {
    cascade: true,
  })
  posts: Post[];

  @OneToMany(() => ProfileStatistic, (statics) => statics.owner, {
    cascade: true,
  })
  statistic: ProfileStatistic[];

}
