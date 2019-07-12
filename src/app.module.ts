import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientService } from './http-client.service';
import { MemoryService } from './memory.service';
import { InitChatEventHandler, HiChatEventHandler, FirstNameChatHandler, BirthDateChatHandler } from './event';
import { CqrsModule } from '@nestjs/cqrs';

export const EVENT_HANDLER_PROVIDER: any[] = [
  InitChatEventHandler,
  HiChatEventHandler,
  FirstNameChatHandler,
  BirthDateChatHandler
];

@Module({
  imports: [HttpModule, CqrsModule],
  controllers: [AppController],
  providers: [AppService, HttpClientService, MemoryService, ...EVENT_HANDLER_PROVIDER]
})
export class AppModule {}
