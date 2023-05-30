import { omit } from 'lodash';
import { getOwnerLang } from './get-owner-lang';

export const filterByLanguage = (owners, language) =>
  owners
    .map((owner) => {
      return { ...owner, language: getOwnerLang(owner) };
    })
    .filter((owner) => owner.language === language);

export const getOwnerEngagement = (owner) => {
  let values = 0;

  owner.posts.forEach((post) => {
    const {
      likesCount = 0,
      commentsCount = 0,
      videoPlayCount = 0,
      videoViewCount = 0,
    } = post;
    values += likesCount;
    values += commentsCount;
    values += videoPlayCount;
    values += videoViewCount;
  });

  const owner_engagement = values / (owner.followersCount || 1);
  return {
    ...owner,
    overall_engagement: owner_engagement,
    total_engagement: values,
  };
};

export const filterByOverallEng = (owners, overall_engagement) =>
  owners.filter((owner) => owner.overall_engagement > +overall_engagement);
