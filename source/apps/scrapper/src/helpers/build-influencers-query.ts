

export interface IIFilters {
  followers_min?: number;
  followers_max?: number;
  bio?: string;
  verified?: boolean;
  contacts?: boolean;
  hashtags?: string[];
  mentions?: string[];
  keyword?: string;
  isBusinessAccount?: boolean;
  lastPost?: number;
  engagement?: number;
  language?: string;
  overall_engagement?: string;
  postType?: 'Image' | 'Video' | 'Sidecar';
  page?: string;
  pageSize?: string;
}

export const buildInfQuery = (
  filters: IIFilters,
  queryBuilder,
  postRepository,
  postOwnerRepository,
) => {
  const {
    followers_min,
    followers_max,
    bio,
    verified,
    contacts,
    hashtags,
    mentions,
    keyword,
    isBusinessAccount,
    postType,
    lastPost,
    engagement,
    overall_engagement,
  } = filters;

  if (followers_min && followers_max) {
    queryBuilder.andWhere('postOwner.followersCount BETWEEN :min AND :max', {
      min: followers_min,
      max: followers_max,
    });
  } else {
    if (followers_min)
      queryBuilder.andWhere('postOwner.followersCount >= :min', {
        min: followers_min,
      });
    if (followers_max)
      queryBuilder.andWhere('postOwner.followersCount <= :max', {
        max: followers_max,
      });
  }

  if (bio) {
    queryBuilder.andWhere('postOwner.biography ILIKE :bio', {
      bio: `%${bio}%`,
    });
  }
  if (contacts) {
    queryBuilder.andWhere('postOwner.email ILIKE :email', {
      email: '%@%',
    });
  }
  if (verified) {
    queryBuilder.andWhere('postOwner.verified = :verified', {
      verified,
    });
  }
  if (isBusinessAccount) {
    queryBuilder.andWhere('postOwner.isBusinessAccount = :isBusinessAccount', {
      isBusinessAccount,
    });
  }

  if (hashtags?.length) {
    queryBuilder.andWhere('hashtag.name IN (:...hashtagNames)', {
      hashtagNames: hashtags,
    });
  }

  if (mentions?.length) {
    queryBuilder.andWhere('mention.username IN (:...mentions)', {
      mentions: ['asos'],
    });
  }
  if (keyword) {
    queryBuilder.andWhere('post.caption ILIKE :caption', {
      caption: `%${keyword}%`,
    });
  }
  if (postType) {
    queryBuilder.andWhere('post.type = :type', {
      type: postType,
    });
  }

  if (lastPost) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - lastPost);

    // Get the subquery to retrieve the maximum created_at for each PostOwner's post
    const subQuery = postOwnerRepository
      .createQueryBuilder('postOwner')
      .leftJoin('postOwner.posts', 'post')
      .select('MAX(post.timestamp)')
      .where('post.owner.ownerUsername = postOwner.ownerUsername')
      .getQuery();

    // Build the main query to fetch PostOwner entities
    queryBuilder
      .andWhere(`post.timestamp >= :daysAgo`, { daysAgo })
      .andWhere(`post.timestamp <= (${subQuery})`)
      .orderBy('post.timestamp', 'DESC');
  }

  if (engagement) {
    queryBuilder
      .andWhere('postOwner.followersCount > 0')
      .andWhere('postOwner.followersCount IS NOT NULL')
      .andWhere(
        '((COALESCE(post.likesCount, 0) + COALESCE(post.commentsCount, 0)) * 100 / COALESCE(postOwner.followersCount, 1)) >= :engagement',
        { engagement: +engagement * 100 },
      );
  }

  if (overall_engagement) {
   
  }

  return queryBuilder;
};
