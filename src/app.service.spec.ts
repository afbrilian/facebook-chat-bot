import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { EventBus, CommandBus } from '@nestjs/cqrs';
import { MemoryService } from './memory.service';
import { FbMessage } from './fb';
import { History } from './app.model';
import { ChatState } from './app.state';
import { of } from 'rxjs';

describe('AppService', () => {
  let appService: AppService;
  let memoryService: MemoryService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppService],
      providers: [MemoryService, EventBus, CommandBus]
    }).compile();

    memoryService = app.get<MemoryService>(MemoryService);
    eventBus = app.get<EventBus>(EventBus);
    appService = app.get<AppService>(AppService);
  });

  it('should publish event when no history recorded', () => {
    const fbMessage: FbMessage = {
      sender: { id: '1' },
      recipient: { id: '2' },
      message: { mid: '1id', text: 'Hi' }
    };

    const history: History = {
      id: '1',
      data: { firstName: 'Afif', birthDate: new Date(1992, 10, 3) },
      state: ChatState.INIT
    };

    jest.spyOn(memoryService, 'getById').mockImplementation(() => of(null));
    jest.spyOn(memoryService, 'createHistory').mockImplementation(() => of(history));
    jest.spyOn(eventBus, 'publish').mockImplementation();
    appService.send(fbMessage);

    expect(memoryService.getById).toBeCalled();
    expect(memoryService.createHistory).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });

  it('should publish event when a history exist and yet to be done', () => {
    const fbMessage: FbMessage = {
      sender: { id: '1' },
      recipient: { id: '2' },
      message: { mid: '1id', text: 'Hi' }
    };

    const history: History = {
      id: '1',
      data: { firstName: 'Afif', birthDate: new Date(1992, 10, 3) },
      state: ChatState.HI
    };

    jest.spyOn(memoryService, 'getById').mockImplementation(() => of(history));
    jest.spyOn(eventBus, 'publish').mockImplementation();
    appService.send(fbMessage);

    expect(memoryService.getById).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });

  it('should not publish event when a history state is done', () => {
    const fbMessage: FbMessage = {
      sender: { id: '1' },
      recipient: { id: '2' },
      message: { mid: '1id', text: 'Hi' }
    };

    const history: History = {
      id: '1',
      data: { firstName: 'Afif', birthDate: new Date(1992, 10, 3) },
      state: ChatState.DONE
    };

    jest.spyOn(memoryService, 'getById').mockImplementation(() => of(history));
    appService.send(fbMessage);

    expect(memoryService.getById).toBeCalled();
  });
});
