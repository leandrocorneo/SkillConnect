export class BaseResponseDto<T> {
  statusCode: number;
  message: string;
  data: T;
}
