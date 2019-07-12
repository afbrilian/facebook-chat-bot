import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { HiChatEvent } from './hi-chat.event';
import { HttpClientService } from '../http-client.service';
import { MemoryService } from '../memory.service';
import { ChatState } from '../app.state';
import { switchMap, concatMap } from 'rxjs/operators';

@EventsHandler(HiChatEvent)
export class HiChatEventHandler implements IEventHandler<HiChatEvent> {
  constructor(private readonly httpClientService: HttpClientService, private readonly memoryService: MemoryService) {}

  handle(event: HiChatEvent) {
    const history = event.history;
    const chat = event.chat();

    this.memoryService
      .updateHistory(history.id, ChatState.FIRST_NAME, { firstName: chat.text, birthDate: null }, chat)
      .pipe(
        switchMap((h) =>
          this.httpClientService.send(history.id, { text: `Great! Nice to meet you ${h.data.firstName}!!` })
        ),
        concatMap(() => this.httpClientService.send(history.id, { text: 'May we know your birth date?' }))
      )
      .subscribe();
  }
}
