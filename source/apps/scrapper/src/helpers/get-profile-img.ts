import axios from 'axios';

export const getProfilePicUrl = async (username) => {
  try {
    const accessToken =
      'EAAFSQHxZCrygBAGHYlZB0ZADdfmlKcAbZBiQmhxYxbITuEmLcp63NKjUdxbmupJNaowPZBZAlS7f9B7zOsiOLZBtQcjgufBsVqrQdh2WfZBulJvvCoItf6GJ3fMC5heRBF4E5QNlZBL1Ha9a74gXh5bZAPwBBiv66YnQnZB7AXjfBh1ZCchfXTmolvYq';
    const response = await axios.get(
      `https://graph.facebook.com/v3.2/17841426162983354?fields=business_discovery.username(${username}){profile_picture_url}&access_token=${accessToken}`,
    );

    return response?.data?.data?.business_discovery?.profile_picture_url;
  } catch (e) {
    console.log(e.response.data)
    return '';
  }
};

export const addPictureUrl = async (array) => {
  const newArray = [];

  await Promise.allSettled(
    array.map(async (owner) => {
      const url = await getProfilePicUrl(owner.ownerUsername);
      console.log({ url });
      newArray.push({ ...owner, profilePicUrl: url });
    }),
  );

  return newArray;
};
