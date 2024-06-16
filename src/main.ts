import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Добавили валидацию (происходит до передачи в контроллер) в приложение
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  /* app.useGlobalFilters(new HttpExceptionFilter()); */
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
}
bootstrap();
