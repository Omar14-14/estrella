export interface PinValidationRequest {
  pin: string;
}

export interface AuthToken {
  sessionId: string;
  iat: number;
  exp: number;
}
