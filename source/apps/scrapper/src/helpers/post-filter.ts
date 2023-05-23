export const postFilter = (posts, { engagement }) => {
  let filteredPosts = posts;

  if (engagement) {
    filteredPosts = posts.filter((post) => {
      const eng_rate = post?.engagement / (post.owner.followersCount || 1);
      return eng_rate > engagement;
    });
  }

  return filteredPosts;
};
