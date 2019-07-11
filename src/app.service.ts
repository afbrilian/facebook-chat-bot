import { Injectable, HttpService } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { HttpClientService } from './http-client.service';

@Injectable()
export class AppService {
  constructor(private readonly httpClientService: HttpClientService) {}

  send(recipientId: string, message: any): void {
    this.httpClientService.send(recipientId, message);
  }
}
