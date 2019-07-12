import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientService } from './http-client.service';
import { MemoryService } from './memory.service';
import { InitChatEventHandler } from './event';
import { CqrsModule } from '@nestjs/cqrs';

const handler = [InitChatEventHandler];

@Module({
  imports: [HttpModule, CqrsModule],
  controllers: [AppController],
  providers: [AppService, HttpClientService, MemoryService, ...handler]
})
export class AppModule {}
