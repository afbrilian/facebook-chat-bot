import { Injectable } from '@nestjs/common';
import { History, Message } from './app.model';
import { Observable, of } from 'rxjs';
import { FbMessage } from './fb/fb-responses';
import { ChatState } from './app.state';

@Injectable()
export class MemoryService {
  private histories: History[] = [];
  private chatHistories: Message[] = [];

  getById(id: string): Observable<History> {
    return of(this.histories.find((history) => history.id === id));
  }

  createHistory(fbMessage: FbMessage): History {
    const history: History = {
      id: fbMessage.sender.id,
      data: null,
      state: ChatState.INIT
    };
    this.histories.push(history);
    return history;
  }
}
