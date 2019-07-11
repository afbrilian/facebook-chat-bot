import { Controller, Get, Req, Res, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'facebook chat bot WebHook';
  }

  @Get('webhook')
  getWebhook(@Req() req: Request, @Res() res: Response): void {
    const VERIFY_TOKEN = 'testBot_verify_token>';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }

  @Post('webhook')
  postWebHook(@Req() req: Request, @Res() res: Response): void {
    const body = req.body;
    if (body.object === 'page') {
      body.entry.forEach((entry) => {
        const webhookEvent = entry.messaging[0];
        if (webhookEvent && webhookEvent.message && webhookEvent.message.text) {
          console.log(webhookEvent);
          this.appService.send(webhookEvent.sender.id, { text: webhookEvent.message.text });
        }
      });
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  }
}
