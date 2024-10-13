import { applyDecorators } from '@nestjs/common';
type TAnyDecorator = ClassDecorator | MethodDecorator | PropertyDecorator;

export const AbstractCreateDocs =
  (commonDecorators: TAnyDecorator[] = []) =>
  (endpointDecorators: TAnyDecorator[] = []) =>
    applyDecorators(...commonDecorators, ...endpointDecorators);
