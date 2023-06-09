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
  async getInfluencers(filters) {
    try {
      const data = await this.scrapperService.getInfluencers(filters);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  @MessagePattern('get-influencers-by-id')
  async getInfluencerById({ username }) {
    try {
      const data = await this.scrapperService.getInfluencerById(username);

      return { influencer: data };
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
