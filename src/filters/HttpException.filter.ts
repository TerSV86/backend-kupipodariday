import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.getResponse();

    const context = host.switchToHttp();
    /* const request = context.getRequest(); */
    const response = context.getResponse();

    response.status(status).json({
      error: {
        status: status,
        message: message,
        /* method: request.method, */
      },
    });
  }
}
