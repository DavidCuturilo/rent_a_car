import { InternalResponse } from './internal-response-model.dto';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, InternalResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<InternalResponse<T>> {
    const body = context.switchToHttp().getResponse();

    return next
      .handle()
      .pipe(map((payload) => ({ status: body.statusCode, payload })));
  }
}
