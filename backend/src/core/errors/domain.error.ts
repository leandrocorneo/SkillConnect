export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ResourceNotFoundError extends DomainError {
  constructor(resource: string) {
    super(`${resource} not found`);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
