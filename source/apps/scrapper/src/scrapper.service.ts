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
  sortArrayByOrder,
} from './helpers';
import { IFilters, buildPostsQuery } from './helpers';
import { count } from 'console';

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

  async getInfluencers(filters) {
    const {
      page = 0,
      pageSize = 50,
      sort = 'followersCount_desc',
      language,
      overallEngagement,
    } = filters || {};

    let queryBuilder = this.postOwner
      .createQueryBuilder('postOwner')
      .leftJoinAndSelect('postOwner.posts', 'post')
      .leftJoinAndSelect('post.tagged_accounts', 'tagged_account')
      .leftJoinAndSelect('post.hashtags', 'hashtag')
      .leftJoinAndSelect('post.mentions', 'mention');

    queryBuilder = await buildInfQuery(
      filters,
      queryBuilder,
      this.post,
      this.postOwner,
    );

    const totalCount = await queryBuilder.getCount();

    // Apply sorting
    const [sortField, sortType] = sort.split('_');

    if (sortField.includes('follow')) {
      queryBuilder.orderBy(
        `postOwner.${sortField}`,
        sortType.toUpperCase(),
        'NULLS LAST',
      );
    }

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

    if (sortField.includes('engagement')) {
      filteredPosts = filteredPosts.sort((a: any, b: any) => {
        return sortType === 'asc'
          ? a.overall_engagement - b.overall_engagement
          : b.overall_engagement - a.overall_engagement;
      });
    }

    const count =
      language || overallEngagement ? filteredPosts?.length : totalCount;

    return { totalCount: count, filteredPosts };
  }

  async getPosts(filters: IFilters) {
    const {
      page = 0,
      pageSize = 50,
      sort = 'post.likesCount-desc',
    } = filters || {};

    let queryBuilder = this.post
      .createQueryBuilder('post')
      .leftJoin('post.owner', 'owner')
      .leftJoin('post.hashtags', 'hashtag')
      .leftJoin('post.mentions', 'mention');

    // Apply all filters
    queryBuilder = buildPostsQuery(filters, queryBuilder);

    // Count the total number of filtered posts
    const totalCount = await queryBuilder.getCount();

    // Apply sorting
    const [sortField, sortType] = sort.split('-');

    queryBuilder.orderBy(
      sortField,
      sortType === 'asc' ? 'ASC' : 'DESC',
      'NULLS LAST',
    );

    // Apply pagination
    queryBuilder.take(pageSize);
    queryBuilder.skip(pageSize * page);


    // Get missing relations
    const filteredPosts = await queryBuilder.getMany();
    const filteredPostsIds = filteredPosts.map((post) => post.shortCode);

    let fullPosts = await this.post.find({
      where: { shortCode: In(filteredPostsIds) },
      relations: { owner: true, hashtags: true, mentions: true },
    });

    return {
      totalCount,
      filteredPosts: sortArrayByOrder(filteredPosts, fullPosts),
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
