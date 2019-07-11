import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientService } from './http-client.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, HttpClientService],
})
export class AppModule {}
