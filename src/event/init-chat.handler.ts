import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { InitChatEvent } from './init-chat.event';
import { HttpClientService } from '../http-client.service';
import { MemoryService } from '../memory.service';
import { ChatState } from '../app.state';
import { switchMap, concatMap } from 'rxjs/operators';

@EventsHandler(InitChatEvent)
export class InitChatEventHandler implements IEventHandler<InitChatEvent> {
  constructor(private readonly httpClientService: HttpClientService, private readonly memoryService: MemoryService) {}

  handle(event: InitChatEvent) {
    const history = event.history;
    const chat = event.chat();

    this.memoryService
      .updateHistory(history.id, ChatState.HI, null, chat)
      .pipe(
        switchMap((h) => this.httpClientService.send(history.id, { text: 'Hi!' })),
        concatMap(() => this.httpClientService.send(history.id, { text: 'May we know your first name?' }))
      )
      .subscribe();
  }
}
