import { Injectable } from '@nestjs/common';
import { Apify } from './api/api';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const { TAGGED_SCRAPPER_ID, PROFILE_SCRAPER_ID } = process.env;

@Injectable()
export class ApifyService {
  async runScraper(id: string, body?: any) {
    return Apify.post(`/acts/${id}/run-sync-get-dataset-items`, body);
  }

  async getInfluencers(username: string) {
    const response = await this.runScraper(TAGGED_SCRAPPER_ID, {
      username: [username],
    });

    const usernames = response.data?.map((post) => post.ownerUsername);

    return this.runScraper(PROFILE_SCRAPER_ID, { usernames });
  }
}
