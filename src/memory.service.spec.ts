import { MemoryService } from './memory.service';
import { of } from 'rxjs';
import { ChatState } from './app.state';

describe('HttpClientService', () => {
  let memoryService: MemoryService;

  beforeEach(() => {
    memoryService = new MemoryService();

    memoryService.createHistory({
      sender: { id: '1' },
      recipient: { id: '2' },
      message: { mid: '1id', text: 'Hi' }
    });
    memoryService.updateHistory(
      '1',
      ChatState.HI,
      { firstName: 'Brilian', birthDate: null },
      { id: '1id', text: 'Hi', historyId: '1' }
    );

    memoryService.createHistory({
      sender: { id: '2' },
      recipient: { id: '2' },
      message: { mid: '1id', text: 'Afif' }
    });
    memoryService.updateHistory(
      '2',
      ChatState.DONE,
      { firstName: 'Afif', birthDate: new Date(1992, 10, 3) },
      { id: '1id', text: 'Hi', historyId: '2' }
    );
  });

  it('should return observable of history by id', (done) => {
    memoryService.getById('1').subscribe((history) => {
      expect(history.id).toBe('1');
      expect(history.data.firstName).toBe('Brilian');
      done();
    });
  });

  it('should create history and return the observable of history', (done) => {
    memoryService
      .createHistory({ sender: { id: '3' }, recipient: { id: '2' }, message: { mid: '1id', text: 'Hi' } })
      .subscribe((history) => {
        expect(history.id).toBe('3');
        expect(history.data).toBe(null);
        done();
      });
  });

  it('should update history and return the observable of history', (done) => {
    memoryService
      .updateHistory(
        '2',
        ChatState.HI,
        { firstName: 'Fahmi', birthDate: null },
        { id: '1id', text: 'Fahmi', historyId: '2' }
      )
      .subscribe((history) => {
        expect(history.id).toBe('2');
        expect(history.data.firstName).toBe('Fahmi');
        done();
      });
  });

  it('should return all chat histories', () => {
    const chats = memoryService.getAllChatHistory();
    expect(chats.length).toBe(2);
    expect(chats[0].id).toBe('1id');
  });

  it('should return one chat history', () => {
    const chat = memoryService.getChatHistory('1id');
    expect(chat.id).toBe('1id');
    expect(chat.text).toBe('Hi');
  });

  it('should delete one chat history', () => {
    let chats = memoryService.getAllChatHistory();
    expect(chats.length).toBe(2);
    memoryService.deleteChatHistory(chats[0].id);
    chats = memoryService.getAllChatHistory();
    expect(chats.length).toBe(1);
  });
});
