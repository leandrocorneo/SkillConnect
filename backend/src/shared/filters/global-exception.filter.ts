import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
    BadRequestError,
  ConflictError,
  DomainError,
  ForbiddenError,
  ResourceNotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../core/errors/domain.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();
      
      if (typeof responseData === 'string') {
        message = responseData;
      } else if (typeof responseData === 'object' && responseData !== null) {
        message = (responseData as any).message || message;
        errorDetails = responseData;
      }
    } else if (exception instanceof DomainError) {
      if (exception instanceof ResourceNotFoundError) {
        status = HttpStatus.NOT_FOUND;
        message = exception.message;
      } else if(exception instanceof UnauthorizedError) {
        status = HttpStatus.UNAUTHORIZED;
        message = exception.message;
      }else if (exception instanceof ValidationError) {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
      } else if (exception instanceof ConflictError) {
        status = HttpStatus.CONFLICT;
        message = exception.message;
      } else if(exception instanceof ForbiddenError){
        status = HttpStatus.FORBIDDEN;
        message = exception.message;
      } else if(exception instanceof BadRequestError){
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unexpected error: ${exception.message}`, exception.stack);
      message = exception.message; 
    }

    const responseBody = {
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
      data: null,
    };

    response.status(status).json(responseBody);
  }
}
