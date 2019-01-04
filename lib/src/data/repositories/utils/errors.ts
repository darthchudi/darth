enum RepoErrors {
  DuplicateModel = 'DUPLICATE_MODEL',
  ModelNotFound = 'MODEL_NOT_FOUND',
}

class RepositoryError extends Error {
  repositoryError: string;
  constructor(message, repositoryError: string) {
    super(message);
    this.repositoryError = repositoryError;
  }
}

export class DuplicateModelError extends RepositoryError {
  constructor(message: string) {
    super(message, RepoErrors.DuplicateModel);
  }
}

export class ModelNotFoundError extends RepositoryError {
  constructor(message: string) {
    super(message, RepoErrors.ModelNotFound);
  }
}
