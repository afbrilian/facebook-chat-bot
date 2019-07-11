import { Injectable, HttpService } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { FbMessage, FbReply } from './fb/fb-responses';
import { MemoryService } from './memory.service';
import { History, Message } from './app.model';
import { filter, map } from 'rxjs/operators';
import { ChatState } from './app.state';

@Injectable()
export class AppService {
  constructor(private readonly memoryService: MemoryService, private readonly httpClientService: HttpClientService) {}

  send(fbMessage: FbMessage): void {
    this.memoryService
      .getById(fbMessage.sender.id)
      .pipe(
        filter((history) => !history || (history && history.state !== ChatState.DONE)),
        map((history) => history ? history : this.memoryService.createHistory(fbMessage))
      )
      .subscribe((history: History) => {
        this.message(history, fbMessage);
      });
  }

  message(history: History, fbMessage: FbMessage): void {
    let message: FbReply;

    const chat: Message = {
      id: fbMessage.message.mid,
      text: fbMessage.message.text,
      historyId: history.id
    };

    switch (history.state) {
      case ChatState.INIT:
        this.memoryService.updateHistory(history.id, ChatState.HI, null, chat).subscribe((h) => {
          message = { text: 'Hi! May we know your first name?' };
          this.httpClientService.send(h.id, message);
        });
        break;
      case ChatState.HI:
        break;
      case ChatState.FIRST_NAME:
        break;
      case ChatState.BIRTH_DATE:
        break;
      case ChatState.DONE:
        break;
    }
  }
}
