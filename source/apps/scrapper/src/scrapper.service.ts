import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Account,
  Hashtag,
  Mention,
  Post,
  PostOwner,
  TaggedUser,
} from './schemas';
import { getFilters } from './helpers';
import { getPostsFilters } from './helpers/get-posts-filters';

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

  async getPosts(filters) {
    const { pageSize, page } = filters;

    const db_filters = getPostsFilters(filters);

    const posts = await this.post.find({
      where: db_filters,
      relations: {
        owner: true,
        hashtags: true,
        mentions: true,
      },
      ...(pageSize ? { take: pageSize } : {take:10000 }),
      ...(page ? { skip: (page - 1) * pageSize } : {}),
    });

    return posts || [];
  }
}
