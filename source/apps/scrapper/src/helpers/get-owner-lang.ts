import LanguageDetect from 'languagedetect';
import { getPopularValue } from './get-popular-value';

const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2');

export const getOwnerLang = (owner) => {
  const languages = [];

  owner.posts.forEach((post) => {
    const lang = lngDetector.detect(post.caption || '', 1);
    if (!lang?.length) return;
    languages.push(lang[0][0]);
  });

  return getPopularValue(languages);
};
