import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/HttpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Добавили валидацию (происходит до передачи в контроллер) в приложение
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  /* app.useGlobalFilters(new HttpExceptionFilter()); */
  await app.listen(3001);
}
bootstrap();
