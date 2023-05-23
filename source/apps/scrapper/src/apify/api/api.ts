import axios from 'axios';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const { APIFY_BASE_URL, APIFY_CLIENT_SECRET } = process.env;

export const Apify = axios.create({
  baseURL: APIFY_BASE_URL,
  params: { token: APIFY_CLIENT_SECRET },
  headers: { 'Content-type': 'application/json' },
});
