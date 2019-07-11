import { Controller, Get, Req, Res, Post, Query, Body } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { FbMessageEntry, FbEntry, FbMessage } from './fb/fb-responses';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'facebook chat bot WebHook';
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
          console.log(webhookEvent);
          this.appService.send(webhookEvent);
        }
      });
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  }
}
