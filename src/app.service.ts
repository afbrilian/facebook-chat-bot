import { Injectable, HttpService } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { FbMessage } from './fb/fb-responses';
import { MemoryService } from './memory.service';
import { History } from './app.model';

@Injectable()
export class AppService {
  constructor(private readonly memoryService: MemoryService, private readonly httpClientService: HttpClientService) {}

  send(fbMessage: FbMessage): void {
    this.memoryService.getById(fbMessage.sender.id).subscribe((history: History) => {
      history = history ? history : this.memoryService.createHistory(fbMessage);
      this.message(history, fbMessage);
    });
  }

  message(history: History, fbMessage: FbMessage): void {
    this.httpClientService.send(history.id, { text: fbMessage.message.text });
  }
}
