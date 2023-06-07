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
  selectedLocations?: string[];
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
    selectedLocations,
  } = filters;

  if (likes) {
    queryBuilder.andWhere('post.likesCount >= :likes', { likes });
  }

  if (keywords) {
    queryBuilder.andWhere('post.caption ILIKE :keywords', {
      keywords: `%${keywords}%`,
    });
  }

  if (selectedLocations?.length) {
    queryBuilder.andWhere('post.locationName ILIKE ANY(:searchStrings)', {
      searchStrings: selectedLocations.map((str) => `%${str}%`),
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
        '(post.engagement / owner.followersCount) * 100  >= :engagement',
        { engagement: +engagement * 100 },
      );
  }

  if (period) {
    const date = subDays(new Date(), period);
    queryBuilder.andWhere('post.timestamp >= :date', { date });
  }

  if (hashtags && hashtags?.length) {
    queryBuilder.andWhere('hashtag.id IN (:...hashtagNames)', {
      hashtagNames: hashtags,
    });
  }

  if (mentions && mentions?.length) {
    queryBuilder.andWhere('mention.id IN (:...mentionNames)', {
      mentionNames: mentions,
    });
    queryBuilder.orWhere('tagged_account.username IN (:...mentionNames)', {
      mentionNames: mentions,
    });
  }

  // Calculate rate field
  queryBuilder.addSelect(
    'CASE WHEN owner.followersCount > 0 THEN (post.engagement / owner.followersCount) ELSE null END',
    'engagement_rate',
  );

  return queryBuilder;
};
