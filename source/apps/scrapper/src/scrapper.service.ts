import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  Account,
  Hashtag,
  Mention,
  Post,
  PostOwner,
  TaggedUser,
} from './schemas';
import { getFilters } from './helpers';
import { IFilters, buildPostsQuery } from './helpers/build-posts-query';

@Injectable()
export class ScrapperService {
  constructor(
    @InjectRepository(Post)
    private readonly post: Repository<Post>,
    @InjectRepository(Account)
    private readonly account: Repository<Account>,
    @InjectRepository(PostOwner)
    private readonly postOwner: Repository<PostOwner>,
    @InjectRepository(TaggedUser)
    private readonly taggedUser: Repository<TaggedUser>,
    @InjectRepository(Mention)
    private readonly mention: Repository<Mention>,
    @InjectRepository(Hashtag)
    private readonly hashtag: Repository<Hashtag>,
  ) {}

  async getInfluencers(username: string, filters) {
    const db_filters = getFilters(filters);

    const account = await this.account.findOne({
      where: { username, posts: db_filters },
      relations: {
        posts: {
          owner: true,
          // hashtags: true,
          // mentions: true,
        },
      },
    });

    if (!account) return;
    return account?.posts;
  }

  async getPosts(filters: IFilters) {
    const { page = 0, pageSize = 50 } = filters;

    let queryBuilder = this.post
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.owner', 'owner')
      .innerJoin('post.hashtags', 'hashtag')
      .innerJoin('post.mentions', 'mention');

    // Apply all filters
    queryBuilder = buildPostsQuery(filters, queryBuilder);

    // Count the total number of filtered posts
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.take(pageSize);
    queryBuilder.skip(pageSize * page);

    const filteredPosts = await queryBuilder.getMany();

    // Get full relations
    const fullPosts = await this.post.find({
      where: { shortCode: In(filteredPosts?.map((post) => post.shortCode)) },
      relations: { hashtags: true, owner: true, mentions: true },
    });

    return {
      totalCount,
      fullPosts,
    };
  }
}
