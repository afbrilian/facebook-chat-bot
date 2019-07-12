import { Injectable } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { FbMessage } from './fb/fb-responses';
import { MemoryService } from './memory.service';
import { History, Message, UserData } from './app.model';
import { filter, flatMap, switchMap, concatMap } from 'rxjs/operators';
import { ChatState } from './app.state';
import { of } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly memoryService: MemoryService, private readonly httpClientService: HttpClientService) {}

  send(fbMessage: FbMessage): void {
    this.memoryService
      .getById(fbMessage.sender.id)
      .pipe(
        filter((history) => !history || (history && history.state !== ChatState.DONE)),
        flatMap((history) => (history ? of(history) : this.memoryService.createHistory(fbMessage)))
      )
      .subscribe((history: History) => this.message(history, fbMessage));
  }

  message(history: History, fbMessage: FbMessage): void {
    const chat: Message = {
      id: fbMessage.message.mid,
      text: fbMessage.message.text,
      historyId: history.id
    };

    switch (history.state) {
      case ChatState.INIT:
        this.memoryService
          .updateHistory(history.id, ChatState.HI, null, chat)
          .pipe(
            switchMap((h) => this.httpClientService.send(history.id, { text: 'Hi!' })),
            concatMap(() => this.httpClientService.send(history.id, { text: 'May we know your first name?' }))
          )
          .subscribe();
        break;
      case ChatState.HI:
        const userData: UserData = { firstName: fbMessage.message.text, birthDate: null };
        this.memoryService
          .updateHistory(history.id, ChatState.FIRST_NAME, userData, chat)
          .pipe(
            switchMap((h) =>
              this.httpClientService.send(history.id, { text: `Great! Nice to meet you ${h.data.firstName}!!` })
            ),
            concatMap(() => this.httpClientService.send(history.id, { text: 'May we know your birth date?' }))
          )
          .subscribe();
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
