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
import {
  buildInfQuery,
  filterByLanguage,
  filterByOverallEng,
  getOwnerEngagement,
} from './helpers';
import { IFilters, buildPostsQuery } from './helpers';

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
    const {
      page = 0,
      pageSize = 50,
      language,
      overallEngagement,
    } = filters || {};

    let queryBuilder = this.postOwner
      .createQueryBuilder('postOwner')
      .leftJoinAndSelect('postOwner.posts', 'post')
      .leftJoin('post.tagged_accounts', 'tagged_account')
      .leftJoinAndSelect('post.hashtags', 'hashtag')
      .leftJoinAndSelect('post.mentions', 'mention')
      .where('tagged_account.username LIKE :username', { username });

    queryBuilder = await buildInfQuery(
      filters,
      queryBuilder,
      this.post,
      this.postOwner,
    );

    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.take(pageSize);
    queryBuilder.skip(pageSize * page);

    let filteredPosts = await queryBuilder.getMany();
    filteredPosts = filteredPosts.map((owner) => getOwnerEngagement(owner));

    if (language) {
      filteredPosts = filterByLanguage(filteredPosts, language);
    }

    if (overallEngagement) {
      filteredPosts = filterByOverallEng(filteredPosts, overallEngagement);
    }

    const count =
      language || overallEngagement ? filteredPosts?.length : totalCount;

    return { totalCount: count, filteredPosts };
  }

  async getPosts(filters: IFilters) {
    const { page = 0, pageSize = 50 } = filters || {};

    let queryBuilder = this.post
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.owner', 'owner')
      .leftJoin('post.hashtags', 'hashtag')
      .leftJoin('post.mentions', 'mention');

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
      order: { timestamp: 'DESC' },
    });

    return {
      totalCount,
      filteredPosts: fullPosts,
    };
  }

  async getPostById(id: string) {
    return this.post.findOne({
      where: { id },
      relations: {
        tagged_accounts: true,
        mentions: true,
        hashtags: true,
        owner: true,
      },
    });
  }
}
