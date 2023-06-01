import LanguageDetect from 'languagedetect';

const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2');

export function calculateTotalMetrics(user) {
  let totalLikes = 0;
  let totalComments = 0;
  let videoViews = 0;
  let videoPlays = 0;
  let posts = [];
  let language;

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

      if (post.caption) {
        const lang = lngDetector.detect(post.caption, 1);

        if (lang?.length) {
          language = lang[0][0];
        }
      }

      return { ...post, eng_rate, language };
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
