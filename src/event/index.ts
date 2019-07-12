import { InitChatEventHandler } from './init-chat.handler';
import { HiChatEventHandler } from './hi-chat.handler';
import { FirstNameChatHandler } from './first-name-chat.handler';
import { BirthDateChatHandler } from './birth-date-chat.handler';

export const EVENT_HANDLER_PROVIDER: any[] = [
  InitChatEventHandler,
  HiChatEventHandler,
  FirstNameChatHandler,
  BirthDateChatHandler
];

export const EVENT_HANDLER_CLASSES: any = {
  InitChatEventHandler,
  HiChatEventHandler,
  FirstNameChatHandler,
  BirthDateChatHandler
};

export * from './init-chat.event';
export * from './init-chat.handler';
export * from './hi-chat.event';
export * from './hi-chat.handler';
export * from './first-name-chat.event';
export * from './first-name-chat.handler';
export * from './birth-date-chat.event';
export * from './birth-date-chat.handler';
