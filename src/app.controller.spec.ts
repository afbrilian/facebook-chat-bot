import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemoryService } from './memory.service';
import { EventBus, CommandBus } from '@nestjs/cqrs';
import { Message } from './app.model';
import { Response } from 'jest-express/lib/response';
import { FbMessageEntry } from './fb';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let memoryService: MemoryService;
  let res;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, MemoryService, EventBus, CommandBus]
    }).compile();

    memoryService = app.get<MemoryService>(MemoryService);
    appService = app.get<AppService>(AppService);
    appController = app.get<AppController>(AppController);
    res = new Response();
  });

  afterEach(() => {
    res.resetMocked();
  });

  describe('hello', () => {
    it('should return "facebook chat bot WebHook"', () => {
      expect(appController.getHello()).toBe('facebook chat bot WebHook');
    });
  });

  describe('messages', () => {
    it('should return all messages', () => {
      const result: Message[] = [
        { id: '1', historyId: '1', text: 'chat 1' },
        { id: '2', historyId: '1', text: 'chat 2' },
        { id: '3', historyId: '2', text: 'chat 1' }
      ];
      jest.spyOn(memoryService, 'getAllChatHistory').mockImplementation(() => result);

      const response = appController.getMessages();
      expect(response.length).toEqual(3);
      expect(response[0].id).toEqual('1');
    });

    it('should return single message', () => {
      const result: Message = { id: '1', historyId: '1', text: 'chat 1' };
      jest.spyOn(memoryService, 'getChatHistory').mockImplementation(() => result);

      const response = appController.getMessageById('1');
      expect(response.id).toEqual('1');
      expect(response.text).toEqual('chat 1');
    });

    it('should delete single message and return response', () => {
      const result: Message = { id: '1', historyId: '1', text: 'chat 1' };
      jest.spyOn(memoryService, 'deleteChatHistory').mockImplementation();

      const response = appController.deleteMessageById('1');
      expect(response).toEqual('chat successfully deleted with id: 1');
      expect(memoryService.deleteChatHistory).toBeCalled();
    });
  });

  describe('webhook', () => {
    it('should verify', () => {
      appController.getWebhook('subscribe', 'testBot_verify_token>', 'challenged', res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith('challenged');
    });

    it('failed to verify with wrong token', () => {
      appController.getWebhook('subscribe', 'wrong-token', 'challenged', res);
      expect(res.sendStatus).toBeCalledWith(403);
    });

    it('should receive event', () => {
      const req: FbMessageEntry = {
        object: 'page',
        entry: [
          {
            id: '1',
            time: 1234,
            messaging: [
              {
                sender: { id: '1' },
                recipient: { id: '2' },
                message: { mid: '1msg', text: 'Hi!' }
              }
            ]
          }
        ]
      };
      jest.spyOn(appService, 'send').mockImplementation();
      appController.postWebHook(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith('EVENT_RECEIVED');
      expect(appService.send).toBeCalled();
    });

    it('is not page event', () => {
      const req: FbMessageEntry = {
        object: 'other',
        entry: []
      };
      jest.spyOn(appService, 'send').mockImplementation();
      appController.postWebHook(req, res);
      expect(res.sendStatus).toBeCalledWith(404);
    });
  });
});
