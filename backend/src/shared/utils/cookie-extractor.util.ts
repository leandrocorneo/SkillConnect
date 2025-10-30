import { Request } from 'express';

interface Cookies {
  [key: string]: string;
}

export const cookieExtractor = (req: Request): string | null => {
  const cookies = req.cookies as Cookies;
  return cookies?.auth || null;
};