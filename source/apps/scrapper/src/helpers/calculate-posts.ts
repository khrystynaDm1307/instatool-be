export function calculateTotalMetrics(user) {
  let totalLikes = 0;
  let totalComments = 0;
  let videoViews = 0;
  let videoPlays = 0;
  let posts = [];

  if (user.posts && user.posts.length > 0) {
    posts = user.posts.map((post) => {
      const {
        likesCount = 0,
        commentsCount = 0,
        videoPlayCount = 0,
        videoViewCount = 0,
      } = post;

      const sum = likesCount + commentsCount + videoPlayCount + videoViewCount;

      const eng_rate = sum / (user.followersCount || 1);

      totalLikes += likesCount;
      totalComments += commentsCount;
      videoPlays += videoPlayCount;
      videoViews += videoViewCount;

      return { ...post, eng_rate };
    });
  }

  let eng_rate =
    (totalComments + totalLikes + videoPlays + videoViews) /
    (user.followersCount || 1);

  return {
    totalLikes,
    totalComments,
    videoViews,
    videoPlays,
    eng_rate,
    ...user,
    posts,
  };
}
