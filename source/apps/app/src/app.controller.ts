import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('influencers/:username')
  async getInfluencers(
    @Param() params: { username: string },
    @Query() query: {},
  ) {
    return await this.appService.getInfluencers({ ...params, filters: query });
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
