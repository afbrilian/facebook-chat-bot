import { Injectable } from '@nestjs/common';
import { History, Message, UserData } from './app.model';
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

  createHistory(fbMessage: FbMessage): Observable<History> {
    const history: History = {
      id: fbMessage.sender.id,
      data: null,
      state: ChatState.INIT
    };
    this.histories.push(history);
    return of(history);
  }

  updateHistory(id: string, nextState: ChatState, data: UserData, message: Message): Observable<History> {
    const idx: number = this.histories.findIndex((h) => h.id === id);
    this.histories[idx].state = nextState;
    this.histories[idx].data = data;
    this.chatHistories.push(message);
    return of(this.histories[idx]);
  }
}
