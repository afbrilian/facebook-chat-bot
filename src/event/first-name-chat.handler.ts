import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { FirstNameChatEvent } from './first-name-chat.event';
import { HttpClientService } from '../http-client.service';
import { MemoryService } from '../memory.service';
import { ChatState } from '../app.state';
import { switchMap } from 'rxjs/operators';
import { DateUtils } from '../utils/date-utils';
import { FbBasicPayload } from '../fb';

@EventsHandler(FirstNameChatEvent)
export class FirstNameChatHandler implements IEventHandler<FirstNameChatEvent> {
  constructor(private readonly httpClientService: HttpClientService, private readonly memoryService: MemoryService) {}

  handle(event: FirstNameChatEvent) {
    const history = event.history;
    const chat = event.chat();

    const date = DateUtils.convertDate(chat.text);
    this.memoryService
      .updateHistory(history.id, ChatState.BIRTH_DATE, { firstName: history.data.firstName, birthDate: date }, chat)
      .pipe(
        switchMap((h) => {
          return this.httpClientService.send(history.id, {
            text: 'Do you wanna know how many days until your birthday?',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Yes',
                payload: FbBasicPayload.YES
              },
              {
                content_type: 'text',
                title: 'No',
                payload: FbBasicPayload.NO
              }
            ]
          });
        })
      )
      .subscribe();
  }
}
