import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { MessagePattern } from '@nestjs/microservices';
import { ApifyService } from './apify/apify.service';

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

      return data;

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

  @MessagePattern('get-post-by-id')
  async getPostById({ id }) {
    try {
      const response = await this.scrapperService.getPostById(id);
      return { post: response };
    } catch (error) {
      console.log(error);
    }
  }
}
