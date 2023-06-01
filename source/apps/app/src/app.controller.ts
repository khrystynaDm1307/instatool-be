import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('influencers')
  async getInfluencers(@Query() query: {}) {
    return await this.appService.getInfluencers(query);
  }

  @Get('influencers/:username')
  async getInfluencerById(@Param() params: { username: string }) {
    const { username } = params;
    return await this.appService.getInfluencerById({ username });
  }

  @Get('posts')
  async getPosts(@Query() query: {}) {
    return await this.appService.getPosts(query);
  }

  @Get('posts/:id')
  async getPostById(@Param() params: { id: string }) {
    const { id } = params;
    return await this.appService.getPostById({ id });
  }
}
