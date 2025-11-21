import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
  ArgumentMetadata,
} from '@nestjs/common';
import {
  BaseSchema,
  ValiError,
  parse,
  BaseIssue,
  InferOutput,
  getDotPath,
} from 'valibot';

@Injectable()
export class ValibotPipe<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
> implements PipeTransform
{
  constructor(private readonly schema: TSchema) {}
  transform(
    value: any,
    metadata: ArgumentMetadata,
  ): InferOutput<TSchema> | ValidateResponse {
    if (metadata.type === 'custom') {
      return value;
    }

    try {
      return parse(this.schema, value);
    } catch (error) {
      if (error instanceof ValiError) {
        const payload = this.convertError(error);
        throw new ValibotCustomException(payload);
      }
      throw error;
    }
  }

  private convertError(
    error: ValiError<BaseSchema<unknown, unknown, BaseIssue<unknown>>>,
  ): ValidateResponse {
    const errors = error.issues.reduce<Record<string, string[]>>((acc, row) => {
      const message = row.message;
      let key: string = getDotPath(row) || '';

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(message);
      return acc;
    }, {});
    return {
      message: 'Ошибка валидации',
      errors,
    };
  }
}

type ValidateResponse = {
  message: string;
  errors: Record<string, string[]>;
};

export class ValibotCustomException extends HttpException {
  constructor(data: ValidateResponse) {
    super(data, HttpStatus.BAD_REQUEST);
  }
}
