import { subDays } from 'date-fns';

export interface IFilters {
  period?: number;
  likes?: number;
  hashtags?: string[];
  mentions?: string[];
  keywords?: string;
  engagement?: string;
  postType?: 'Image' | 'Video' | 'Sidecar';
  username?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export const buildPostsQuery = (filters: IFilters, queryBuilder) => {
  const {
    hashtags,
    mentions,
    keywords,
    period,
    likes,
    postType,
    engagement,
    username,
  } = filters;

  if (likes) {
    queryBuilder.andWhere('post.likesCount >= :likes', { likes });
  }

  if (keywords) {
    console.log(keywords);
    queryBuilder.andWhere('post.caption ILIKE :keywords', {
      keywords: `%${keywords}%`,
    });
  }

  if (username) {
    queryBuilder.andWhere('owner.ownerUsername ILIKE :username', {
      username: `%${username}%`,
    });
  }

  if (postType) {
    queryBuilder.andWhere('post.type ILIKE :postType', {
      postType: `%${postType}%`,
    });
  }

  if (engagement) {
    queryBuilder
      .andWhere('owner.followersCount IS NOT NULL')
      .andWhere('owner.followersCount > 0')
      .andWhere(
        '((COALESCE(post.likesCount, 0) + COALESCE(post.commentsCount, 0) + COALESCE(post.videoViewCount, 0) + COALESCE(post.videoPlayCount, 0)) * 100 / COALESCE(owner.followersCount, 1)) >= :engagement',
        { engagement: +engagement * 100 },
      );
  }

  if (period) {
    const date = subDays(new Date(), period);
    queryBuilder.andWhere('post.timestamp >= :date', { date });
  }

  if (hashtags && hashtags?.length) {
    queryBuilder.andWhere('hashtag.name IN (:...hashtagNames)', {
      hashtagNames: hashtags,
    });
  }

  if (mentions && mentions?.length) {
    queryBuilder.andWhere('mention.username IN (:...mentionNames)', {
      mentionNames: mentions,
    });
  }

  // Calculate engagement field
  queryBuilder.addSelect(
    'COALESCE(post.likesCount, 0) + COALESCE(post.commentsCount, 0) + COALESCE(post.videoViewCount, 0) + COALESCE(post.videoPlayCount, 0)',
    'engagement',
  );

  // Calculate rate field
  queryBuilder.addSelect(
    '(CASE WHEN owner.followersCount > 0 THEN (COALESCE(post.likesCount, 0) + COALESCE(post.commentsCount, 0) + COALESCE(post.videoViewCount, 0) + COALESCE(post.videoPlayCount, 0)) / owner.followersCount ELSE 0 END)',
    'engagement_rate',
  );

  return queryBuilder;
};
