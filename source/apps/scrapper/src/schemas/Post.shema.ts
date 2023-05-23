import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PostOwner } from './PostOwner.shema';
import { Mention } from './Mention.shema';
import { Hashtag } from './Hashtag.shema';
import { TaggedUser } from './TaggedUser.schema';
import { Account } from './Account.schema';

@Entity()
export class Post {
  @PrimaryColumn()
  shortCode: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  alt: string;

  @Column({ nullable: true })
  caption: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  id: string;

  @Column({ nullable: true })
  displayUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true })
  timestamp: string;

  @Column({ nullable: true })
  locationName: string;

  @Column({ nullable: true })
  locationId: string;

  @Column({ nullable: true })
  productType: string;

  @Column({ nullable: true })
  dimensionsHeight: number;

  @Column({ nullable: true })
  dimensionsWidth: number;

  @Column({ nullable: true })
  commentsCount: number;

  @Column({ nullable: true })
  likesCount: number;

  @Column({ nullable: true })
  videoViewCount: number;

  @Column({ nullable: true })
  videoPlayCount: number;

  @Column({ nullable: true })
  videoDuration: string;

  @Column({ nullable: true })
  isSponsored: boolean;

  @Column({ nullable: true })
  engagement: number;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Account, (account) => account.posts, {
    cascade: true,
  })
  @JoinTable()
  tagged_accounts: Account[];

  @ManyToOne(() => PostOwner, (user) => user.posts)
  owner: PostOwner;

  @ManyToMany(() => Mention, (mention) => mention.posts)
  @JoinTable()
  mentions: Mention[];

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts)
  @JoinTable()
  hashtags: Hashtag[];

  @ManyToMany(() => TaggedUser, (user) => user.posts)
  @JoinTable()
  tagged_users: TaggedUser[];
}
