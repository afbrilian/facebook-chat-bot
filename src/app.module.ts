import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientService } from './http-client.service';
import { MemoryService } from './memory.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, HttpClientService, MemoryService],
})
export class AppModule {}
