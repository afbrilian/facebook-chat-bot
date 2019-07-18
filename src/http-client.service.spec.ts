import { HttpClientService } from './http-client.service';
import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';

describe('HttpClientService', () => {
  let httpClientService: HttpClientService;
  let httpService: HttpService;

  beforeEach(() => {
    httpService = new HttpService();
    httpClientService = new HttpClientService(httpService);
  });

  it('should send post request', () => {
    jest.spyOn(httpService, 'post').mockImplementation(() => of(null));
    httpClientService.send('1', { text: 'this is reply' });
    expect(httpService.post).toBeCalled();
  });
});
