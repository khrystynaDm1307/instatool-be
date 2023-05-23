import { Post } from './Post.shema';
import { Account } from './Account.schema';
import { PostOwner } from './PostOwner.shema';
import { TaggedUser } from './TaggedUser.schema';
import { Mention } from './Mention.shema';
import { Hashtag } from './Hashtag.shema';

export const scrapEntities = [
  Post,
  Account,
  PostOwner,
  Mention,
  TaggedUser,
  Hashtag,
];
