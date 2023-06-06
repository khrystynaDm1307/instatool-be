import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostOwner } from './PostOwner.shema';

@Entity()
export class ProfileStatistic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  followersCount: number;

  @ManyToOne(() => PostOwner, (owner) => owner.statistic)
  owner: PostOwner;
}
