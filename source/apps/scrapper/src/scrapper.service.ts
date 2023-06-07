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
  calculateTotalMetrics,
  filterByLanguage,
  filterByOverallEng,
  getOwnerEngagement,
  sortArrayByOrder,
} from './helpers';
import { IFilters, buildPostsQuery } from './helpers';
import { count } from 'console';
import { concatAll, distinct } from 'rxjs';

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
    } = filters || {};

    let queryBuilder = this.postOwner
      .createQueryBuilder('postOwner')
      .leftJoin('postOwner.posts', 'post')
      .leftJoin('post.tagged_accounts', 'tagged_account')
      .leftJoin('post.hashtags', 'hashtag')
      .leftJoin('post.mentions', 'mention');

    queryBuilder = await buildInfQuery(
      filters,
      queryBuilder,
      this.postOwner,
      true,
    );

    const totalCount = await queryBuilder.getCount();

    // Apply sorting
    const [sortField, sortType] = sort.split('-');

    queryBuilder.orderBy(sortField, sortType.toUpperCase(), 'NULLS LAST');

    // Apply pagination
    queryBuilder.take(pageSize);
    queryBuilder.skip(pageSize * page);

    let owners = await queryBuilder.getMany();
    const usernames = owners.map((o) => o.ownerUsername);

    let fullOwners = await this.postOwner.find({
      where: { ownerUsername: In(usernames) },
      relations: {
        posts: { hashtags: true, mentions: true, tagged_accounts: true },
      },
    });

    if (language) {
      fullOwners = filterByLanguage(owners, language);
    }

    return {
      totalCount: totalCount,
      filteredPosts: owners.map((owner) =>
        fullOwners.find((f) => f.ownerUsername === owner.ownerUsername),
      ),
    };
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
      .leftJoin('post.tagged_accounts', 'tagged_account')
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
      relations: {
        owner: true,
        hashtags: true,
        mentions: true,
        tagged_accounts: true,
      },
    });

    return {
      totalCount,
      filteredPosts: filteredPosts.map((post) =>
        fullPosts.find((p) => p.shortCode === post.shortCode),
      ),
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

  async getInfluencerById(username: string) {
    const user = await this.postOwner.findOne({
      where: { ownerUsername: username },
      relations: {
        posts: { hashtags: true, mentions: true, tagged_accounts: true },
      },
    });

    if (!user) return;

    return calculateTotalMetrics(user);
  }
}
