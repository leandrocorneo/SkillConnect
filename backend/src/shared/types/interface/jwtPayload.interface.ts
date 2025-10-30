export interface JwtPayload {
  document: string;
  sub: number;
  role: string;
  iat: number;
  exp: number;
}