export const getPopularValue = (array) => {
  const b = {};

  array?.forEach((element) => {
    if (b[element]) {
      b[element] = b[element] + 1;
    } else {
      b[element] = 1;
    }
  });

  let maxKey,
    maxValue = 0;

  Object.entries(b).forEach(([key, value]) => {
    if (+value > maxValue) {
      maxValue = +value;
      maxKey = key;
    }
  });

  return maxKey;
};
