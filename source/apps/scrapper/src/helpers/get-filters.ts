import { Between, ILike, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export interface IFilters {
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
}

export const getFilters = (filters: IFilters) => {
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
  } = filters;
  const ownerFilters: any = {};

  if (followers_min && followers_max) {
    ownerFilters.followersCount = Between(followers_min, followers_max);
  } else {
    if (followers_min)
      ownerFilters.followersCount = MoreThanOrEqual(followers_min);
    if (followers_max)
      ownerFilters.followersCount = LessThanOrEqual(followers_max);
  }

  if (bio) {
    ownerFilters.biography = ILike(`%${bio}%`);
  }
  if (contacts) {
    ownerFilters.email = ILike('%@%');
  }
  if (verified) {
    ownerFilters.verified = verified;
  }
  if (isBusinessAccount) {
    ownerFilters.isBusinessAccount = isBusinessAccount;
  }

  const db_filters: any = { owner: ownerFilters };

  if (hashtags?.length) {
    db_filters.hashtags = { name: In(hashtags) };
  }

  if (mentions?.length) {
    db_filters.mentions = { username: In(mentions) };
  }
  if (keyword) {
    db_filters.caption = ILike(`%${keyword}%`);
  }
  if (postType) {
    db_filters.type = postType;
  }

  return db_filters;
};
