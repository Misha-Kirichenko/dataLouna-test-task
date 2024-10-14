import { Request } from 'express';

export const extractTokenFromHeader = (
  request: Request,
  requestedType: string,
): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === requestedType ? token : undefined;
};
