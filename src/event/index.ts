import { InitChatEventHandler, HiChatEventHandler, FirstNameChatHandler, BirthDateChatHandler } from '.';
import { Provider } from '@nestjs/common';

export const EVENT_HANDLER_PROVIDER: Provider[] = [
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
