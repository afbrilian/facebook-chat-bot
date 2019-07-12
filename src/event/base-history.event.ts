import { FbMessage } from '../fb';
import { Message, History } from '../app.model';

export abstract class BaseHistoryEvent {
  constructor(public readonly history: History, public readonly fbMessage: FbMessage) {}

  chat(): Message {
    return {
      id: this.fbMessage.message.mid,
      text: this.fbMessage.message.text,
      historyId: this.history.id
    };
  }
}
