import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Acesse /docs para ver a documentação da API.';
  }
}
