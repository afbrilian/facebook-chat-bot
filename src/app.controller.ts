import { Controller, Get, Res, Post, Query, Body, Param, Delete } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { FbMessageEntry, FbEntry, FbMessage } from './fb/fb-responses';
import { Message } from './app.model';
import { MemoryService } from './memory.service';
import { map } from 'rxjs/operators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly memoryService: MemoryService) {}

  @Get()
  getHello(): string {
    return 'facebook chat bot WebHook';
  }

  @Get('messages')
  getMessages(): Message[] {
    return this.memoryService.getAllChatHistory();
  }

  @Get('messages/:id')
  getMessageById(@Param('id') id: string): Message {
    return this.memoryService.getChatHistory(id);
  }

  @Delete('messages/:id')
  deleteMessageById(@Param('id') id: string): string {
    this.memoryService.deleteChatHistory(id);
    return `chat successfully deleted with id: ${id}`;
  }

  @Get('webhook')
  getWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response
  ): void {
    const VERIFY_TOKEN = 'testBot_verify_token>';
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }

  @Post('webhook')
  postWebHook(@Body() body: FbMessageEntry, @Res() res: Response): void {
    if (body.object === 'page') {
      body.entry.forEach((entry: FbEntry) => {
        const webhookEvent: FbMessage = entry.messaging[0];
        if (webhookEvent && webhookEvent.message && webhookEvent.message.text) {
          this.appService.send(webhookEvent);
        }
      });
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  }
}
