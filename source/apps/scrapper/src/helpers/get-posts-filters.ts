import { Between, ILike, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export interface IFilters {
  period?: number;
  likes?: number;
  hashtags?: string[];
  mentions?: string[];
  keywords?: string;
  engagement?: number;
  postType?: 'Image' | 'Video' | 'Sidecar';
}

export const getPostsFilters = (filters: IFilters) => {
  const { hashtags, mentions, keywords, period, likes, postType, engagement } =
    filters;

  const db_filters: any = {};

  if (hashtags?.length) {
    db_filters.hashtags = { name: In(hashtags) };
  }

  if (mentions?.length) {
    db_filters.mentions = { username: In(mentions) };
  }
  if (keywords) {
    db_filters.caption = ILike(`%${keywords}%`);
  }
  if (postType) {
    db_filters.type = postType;
  }
  if (likes) {
    db_filters.likesCount = MoreThanOrEqual(likes);
  }
  if (period) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() - period);

    db_filters.timestamp = MoreThanOrEqual(deadline);
  }

  if (engagement) {
    db_filters.engagement_rate = MoreThanOrEqual(engagement);
  }

  return db_filters;
};
