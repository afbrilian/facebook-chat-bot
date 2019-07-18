import { HttpService } from '@nestjs/common';
import { HttpClientService } from '../http-client.service';
import { MemoryService } from '../memory.service';
import { FirstNameChatEvent } from './first-name-chat.event';
import { FirstNameChatHandler } from './first-name-chat.handler';
import { FbMessage } from '../fb';
import { ChatState } from '../app.state';
import { History } from '../app.model';
import { of } from 'rxjs';

describe('FirstNameChatHandler', () => {
  let handler: FirstNameChatHandler;
  let event: FirstNameChatEvent;
  let httpClientService: HttpClientService;
  let memoryService: MemoryService;

  beforeEach(() => {
    httpClientService = new HttpClientService(new HttpService());
    memoryService = new MemoryService();
    const fbMessage: FbMessage = {
      sender: { id: '1' },
      recipient: { id: '2' },
      message: { mid: '3id', text: '1992-10-03' }
    };
    event = new FirstNameChatEvent(
      { id: '1', data: { firstName: 'Afif', birthDate: null }, state: ChatState.FIRST_NAME },
      fbMessage
    );
    handler = new FirstNameChatHandler(httpClientService, memoryService);
  });

  it('should handle first name event', () => {
    const history: History = {
      id: '1',
      data: { firstName: 'Afif', birthDate: new Date(1992, 10, 3) },
      state: ChatState.BIRTH_DATE
    };
    jest.spyOn(memoryService, 'updateHistory').mockImplementation(() => of(history));
    jest.spyOn(httpClientService, 'send').mockImplementation(() => of(null));
    handler.handle(event);
    expect(memoryService.updateHistory).toBeCalled();
    expect(httpClientService.send).toBeCalled();
  });
});
