import { omit } from 'lodash';
import { IFilters } from './get-filters';
import { getOwnerLang } from './get-owner-lang';

export const postsFilter = (posts: any[], filters: IFilters) => {
  const { lastPost, engagement, language, overall_engagement } = filters;

  let owners = getOwnersWithPosts(posts);

  if (lastPost) {
    owners = filterByLastPost(owners, lastPost);
  }

  if (engagement) {
    owners = filterByPostEng(owners, engagement);
  }

  if (overall_engagement) {
    owners = filterByOverallEng(owners, overall_engagement);
  }

  if (language) {
    owners = owners
      .map((owner) => {
        return { ...owner, language: getOwnerLang(owner) };
      })
      .filter((owner) => owner.language === language);
  }

  return owners;
};

const getLastPost = (posts) => {
  return posts.sort((a, b) => {
    const date1 = new Date(a.timestamp);
    const date2 = new Date(b.timestamp);
    return date2.getTime() - date1.getTime();
  })[0];
};

const getOwnersWithPosts = (posts) => {
  let data = [];
  const owners = new Set();

  // get unique owners
  posts.map((post) => {
    owners.add(post.owner.ownerUsername);
  });

  // gind posts for every owner
  owners.forEach((owner) => {
    const post = posts
      .filter((post) => post.owner.ownerUsername === owner)
      .map((post) => omit(post, 'owner'));

    const owner_data = posts.find(
      (p) => p.owner.ownerUsername === owner,
    )?.owner;

    data.push({ ...owner_data, posts: post });
  });

  return data.map((owner) => getOwnerEngagement(owner));
};

const getOwnerEngagement = (owner) => {
  let values = 0;

  owner.posts.forEach((post) => {
    if (post.likesCount && post.likesCount > 0) {
      values += post.likesCount;
      values += post.commentsCount;
    }
  });

  const owner_engagement = values / (owner.followersCount || 1);
  return {
    ...owner,
    overall_engagement: owner_engagement,
    total_engagement: values,
  };
};

const getPostEngagement = (post, followersCount) => {
  const { likesCount, commentsCount } = post;
  let engagement = 0;

  if (likesCount > 0) {
    engagement += likesCount;
  }
  if (commentsCount > 0) {
    engagement += commentsCount;
  }

  return { ...post, engagement: engagement / (followersCount || 1) };
};

const filterByLastPost = (owners, lastPost) => {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() - lastPost);

  return owners
    .map((owner) => {
      const lastPost = getLastPost(owner.posts);
      return { ...owner, lastPostDate: lastPost?.timestamp };
    })
    .filter((owner) => new Date(owner.lastPostDate) > deadline);
};

const filterByPostEng = (owners, engagement) => {
  return owners
    .map((owner) => {
      const owner_posts = owner.posts.map((post) =>
        getPostEngagement(post, owner.followersCount),
      );
      return { ...owner, posts: owner_posts };
    })
    .filter((owner) =>
      owner.posts.find((post) => post.engagement > +engagement),
    );
};

const filterByOverallEng = (owners, overall_engagement) =>
  owners.filter((owner) => owner.overall_engagement > +overall_engagement);
