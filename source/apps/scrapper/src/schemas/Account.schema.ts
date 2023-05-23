import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post.shema';

@Entity()
export class Account {
  @PrimaryColumn()
  username: string;
  
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  biography: string;

  @Column({ nullable: true })
  facebookPage: string;

  @Column({ nullable: true })
  externalUrl: string;

  @Column({ nullable: true })
  externalUrlShimmed: string;

  @Column({ nullable: true })
  businessCategoryName: string;

  @Column({ nullable: true })
  profilePicUrl: string;

  @Column({ nullable: true })
  profilePicUrlHD: string;

  @Column({ nullable: true })
  followersCount: number;

  @Column({ nullable: true })
  followsCount: number;

  @Column({ nullable: true })
  highlightReelCount: number;

  @Column({ nullable: true })
  igtvVideoCount: number;

  @Column({ nullable: true })
  postsCount: number;

  @Column({ nullable: true })
  isBusinessAccount: boolean;

  @Column({ nullable: true })
  joinedRecently: boolean;

  @Column({ nullable: true })
  hasChannel: boolean;

  @Column({ nullable: true })
  private: boolean;

  @Column({ nullable: true })
  verified: boolean;

  @Column({ nullable: true })
  isSponsored: boolean;

  @ManyToMany(() => Post, (post)=>post.tagged_accounts)
  @JoinTable()
  posts: Post[]
}
