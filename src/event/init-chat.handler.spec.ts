import { HttpService } from '@nestjs/common';
import { HttpClientService } from '../http-client.service';
import { MemoryService } from '../memory.service';
import { InitChatEvent } from './init-chat.event';
import { InitChatEventHandler } from './init-chat.handler';
import { FbMessage } from '../fb';
import { ChatState } from '../app.state';
import { History } from '../app.model';
import { of } from 'rxjs';

describe('InitChatEventHandler', () => {
  let handler: InitChatEventHandler;
  let event: InitChatEvent;
  let httpClientService: HttpClientService;
  let memoryService: MemoryService;

  beforeEach(() => {
    httpClientService = new HttpClientService(new HttpService());
    memoryService = new MemoryService();
    const fbMessage: FbMessage = {
      sender: { id: '1' },
      recipient: { id: '2' },
      message: { mid: '1id', text: 'Hi' }
    };
    event = new InitChatEvent({ id: '1', data: null, state: ChatState.INIT }, fbMessage);
    handler = new InitChatEventHandler(httpClientService, memoryService);
  });

  it('should handle init event', () => {
    const history: History = {
      id: '1',
      data: null,
      state: ChatState.HI
    };
    jest.spyOn(memoryService, 'updateHistory').mockImplementation(() => of(history));
    jest.spyOn(httpClientService, 'send').mockImplementation(() => of(null));
    handler.handle(event);
    expect(memoryService.updateHistory).toBeCalled();
    expect(httpClientService.send).toBeCalled();
  });
});
