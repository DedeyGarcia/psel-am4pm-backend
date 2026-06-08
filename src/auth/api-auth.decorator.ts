import { ApiSecurity } from '@nestjs/swagger';

export const ApiAuth = () => ApiSecurity({ bearer: [], api_key: [] });
