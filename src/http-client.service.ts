import { Injectable, HttpService } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { FbReply } from './fb/fb-responses';

@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  send(recipientId: string, message: FbReply): void {
    const body = {
      recipient: { id: recipientId },
      message
    };

    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': 'application/json' },
      params: { access_token: process.env.PAGE_ACCESS_TOKEN }
    };

    this.httpService.post('https://graph.facebook.com/v3.3/me/messages', body, config).subscribe();
  }
}
