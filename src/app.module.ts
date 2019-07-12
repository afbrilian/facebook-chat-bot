import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientService } from './http-client.service';
import { MemoryService } from './memory.service';
import { EVENT_HANDLER_PROVIDER } from './event';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [HttpModule, CqrsModule],
  controllers: [AppController],
  providers: [AppService, HttpClientService, MemoryService, ...EVENT_HANDLER_PROVIDER]
})
export class AppModule {}
