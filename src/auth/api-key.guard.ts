import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.config.get<string>('API_KEY');
    if (!required) return true;

    const req = context.switchToHttp().getRequest<Request>();
    if (req.headers['x-api-key'] !== required) {
      throw new UnauthorizedException('API key inválida ou ausente');
    }
    return true;
  }
}
