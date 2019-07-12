import { Injectable } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { FbBasicPayload, FbMessage, FbReply } from './fb';
import { MemoryService } from './memory.service';
import { History, Message } from './app.model';
import { filter, flatMap, switchMap, concatMap } from 'rxjs/operators';
import { ChatState } from './app.state';
import { of } from 'rxjs';
import { DateUtils } from './utils/date-utils';
import { EventBus } from '@nestjs/cqrs';
import { InitChatEvent, HiChatEvent, FirstNameChatEvent, BirthDateChatEvent } from './event';

@Injectable()
export class AppService {
  constructor(
    private readonly memoryService: MemoryService,
    private readonly eventBus: EventBus,
    private readonly httpClientService: HttpClientService
  ) {}

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
        this.eventBus.publish(new InitChatEvent(history, fbMessage));
        break;
      case ChatState.HI:
        this.eventBus.publish(new HiChatEvent(history, fbMessage));
        break;
      case ChatState.FIRST_NAME:
        this.eventBus.publish(new FirstNameChatEvent(history, fbMessage));
        break;
      case ChatState.BIRTH_DATE:
          this.eventBus.publish(new BirthDateChatEvent(history, fbMessage));
        break;
    }
  }
}
