import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  private requestsPerSecond: number = 0;

  @Post('api')
  async handleRequest(@Body() body: { index: number }, @Res() res: Response) {

    if (this.requestsPerSecond >= 50) {
      return res.status(HttpStatus.TOO_MANY_REQUESTS).send();
    }
    this.requestsPerSecond++;
    setTimeout(() => {
      this.requestsPerSecond--;
    }, 1000);

    const delay = Math.floor(Math.random() * 1000) + 1;
    setTimeout(() => {
      res.status(HttpStatus.OK).json({ index: body.index });
    }, delay);
  }
}
