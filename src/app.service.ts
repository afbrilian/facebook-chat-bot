import { Injectable } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { FbBasicPayload, FbMessage } from './fb';
import { MemoryService } from './memory.service';
import { History, Message } from './app.model';
import { filter, flatMap, switchMap, concatMap } from 'rxjs/operators';
import { ChatState } from './app.state';
import { of } from 'rxjs';
import { DateUtils } from './utils/date-utils';

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
        this.memoryService
          .updateHistory(history.id, ChatState.FIRST_NAME, { firstName: fbMessage.message.text, birthDate: null }, chat)
          .pipe(
            switchMap((h) =>
              this.httpClientService.send(history.id, { text: `Great! Nice to meet you ${h.data.firstName}!!` })
            ),
            concatMap(() => this.httpClientService.send(history.id, { text: 'May we know your birth date?' }))
          )
          .subscribe();
        break;
      case ChatState.FIRST_NAME:
        const date = DateUtils.convertDate(fbMessage.message.text);
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
        break;
      case ChatState.BIRTH_DATE:
        this.memoryService
          .updateHistory(history.id, ChatState.DONE, { firstName: fbMessage.message.text, birthDate: null }, chat)
          .pipe(
            switchMap((h) => {
              const days = DateUtils.getDays(h.data.birthDate);
              return this.httpClientService.send(history.id, {
                text: days === 0 ? `HAPPY BIRTHDAY!!🥳🎉🎉` : `There are ${days} days left until your next birthday`
              });
            })
          )
          .subscribe();
        break;
    }
  }
}
