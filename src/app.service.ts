import { Injectable } from '@nestjs/common';
import { FbMessage } from './fb';
import { MemoryService } from './memory.service';
import { History } from './app.model';
import { filter, flatMap } from 'rxjs/operators';
import { ChatState } from './app.state';
import { of } from 'rxjs';
import { EventBus } from '@nestjs/cqrs';
import { EVENT_HANDLER_CLASSES } from './event';

@Injectable()
export class AppService {
  constructor(private readonly memoryService: MemoryService, private readonly eventBus: EventBus) {}

  send(fbMessage: FbMessage): void {
    this.memoryService
      .getById(fbMessage.sender.id)
      .pipe(
        filter((history) => !history || (history && history.state !== ChatState.DONE)),
        flatMap((history) => (history ? of(history) : this.memoryService.createHistory(fbMessage)))
      )
      .subscribe((history: History) => {
        const event = EVENT_HANDLER_CLASSES[history.state];
        this.eventBus.publish(new event(history, fbMessage));
      });
  }
}
