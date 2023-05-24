import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('SCRAPPER_SERVICE') private client: ClientProxy) {
    this.client.connect();
  }
  async getInfluencers(data) {
    return this.client.send('get-influencers', data);
    // .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  async getPosts(data) {
    return this.client.send('get-posts', data);
    // .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}