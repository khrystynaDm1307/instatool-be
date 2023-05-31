export const sortArrayByOrder = (arr1, arr2) => {
    const idMap = arr1.reduce((map, item, index) => {
      map[item] = index;
      return map;
    }, {});
  
    arr2.sort((a, b) => idMap[a.id] - idMap[b.id]);
  
    return arr2;
  };