import { NestFactory } from '@nestjs/core';
import { ScrapperModule } from './scrapper.module';
import { Transport } from '@nestjs/microservices/enums';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces';

const { RABBIT_URL, RABBIT_QUEUE } = process.env;

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ScrapperModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [RABBIT_URL],
        queue: RABBIT_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
