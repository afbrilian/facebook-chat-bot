import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { BirthDateChatEvent } from './birth-date-chat.event';
import { HttpClientService } from '../http-client.service';
import { MemoryService } from '../memory.service';
import { ChatState } from '../app.state';
import { switchMap } from 'rxjs/operators';
import { DateUtils } from '../utils/date-utils';
import { FbMessage, FbBasicPayload, FbReply } from '../fb';

@EventsHandler(BirthDateChatEvent)
export class BirthDateChatHandler implements IEventHandler<BirthDateChatEvent> {
  constructor(private readonly httpClientService: HttpClientService, private readonly memoryService: MemoryService) {}

  private selectYes(fbMessage: FbMessage): boolean {
    const quickReply = fbMessage.message.quick_reply && fbMessage.message.quick_reply.payload === FbBasicPayload.YES;
    const byText = fbMessage.message.text.split(' ').some((token) => /^(yes|yeah|yup|y|ya|ok)$/.test(token));
    return quickReply || byText;
  }

  handle(event: BirthDateChatEvent) {
    const history = event.history;
    const chat = event.chat();

    this.memoryService
      .updateHistory(history.id, ChatState.DONE, history.data, chat)
      .pipe(
        switchMap((h) => {
          const days = DateUtils.getDays(h.data.birthDate);
          const reply: FbReply = {
            text: this.selectYes(event.fbMessage)
              ? days === 0
                ? `HAPPY BIRTHDAY!!🥳🎉🎉`
                : `There are ${days} days left until your next birthday`
              : 'Good Bye👋'
          };
          return this.httpClientService.send(history.id, reply);
        })
      )
      .subscribe();
  }
}
