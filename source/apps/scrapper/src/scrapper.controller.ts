import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { MessagePattern } from '@nestjs/microservices';
import { ApifyService } from './apify/apify.service';
import { postsFilter } from './helpers';
import { postFilter } from './helpers/post-filter';

@Controller()
export class ScrapperController {
  constructor(
    private readonly scrapperService: ScrapperService,
    private readonly apifyService: ApifyService,
  ) {}

  @MessagePattern('get-influencers')
  async getInfluencers(data) {
    const { username, filters } = data || {};

    try {
      if (!username) throw new BadRequestException('Username is missed');

      const data = await this.scrapperService.getInfluencers(username, filters);

      if (!data) return [];

      const owners = postsFilter(data, filters)?.sort((a, b) => {
        const date1 = new Date(a.created_at);
        const date2 = new Date(b.created_at);
        return date2.getTime() - date1.getTime();
      });

      if (!owners) return [];
      return owners;

      // return await addPictureUrl(filteredOwners.slice(0, 3));

      //if (data?.length) return data;

      //   const response = await this.apifyService.getInfluencers(username);

      //return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  @MessagePattern('get-posts')
  async getPosts(filters) {
    try {
      const response = await this.scrapperService.getPosts(filters);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
