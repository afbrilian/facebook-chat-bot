import { HttpService } from '@nestjs/common';
import { HttpClientService } from '../http-client.service';
import { MemoryService } from '../memory.service';
import { HiChatEvent } from './hi-chat.event';
import { HiChatEventHandler } from './hi-chat.handler';
import { FbMessage } from '../fb';
import { ChatState } from '../app.state';
import { History } from '../app.model';
import { of } from 'rxjs';

describe('HiChatEventHandler', () => {
  let handler: HiChatEventHandler;
  let event: HiChatEvent;
  let httpClientService: HttpClientService;
  let memoryService: MemoryService;

  beforeEach(() => {
    httpClientService = new HttpClientService(new HttpService());
    memoryService = new MemoryService();
    const fbMessage: FbMessage = {
      sender: { id: '1' },
      recipient: { id: '2' },
      message: { mid: '2id', text: 'Afif' }
    };
    event = new HiChatEvent({ id: '1', data: null, state: ChatState.HI }, fbMessage);
    handler = new HiChatEventHandler(httpClientService, memoryService);
  });

  it('should handle hi event', () => {
    const history: History = {
      id: '1',
      data: { firstName: 'Afif', birthDate: null },
      state: ChatState.FIRST_NAME
    };
    jest.spyOn(memoryService, 'updateHistory').mockImplementation(() => of(history));
    jest.spyOn(httpClientService, 'send').mockImplementation(() => of(null));
    handler.handle(event);
    expect(memoryService.updateHistory).toBeCalled();
    expect(httpClientService.send).toBeCalled();
  });
});
