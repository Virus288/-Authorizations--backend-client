export default abstract class AbstractController<T, U, Z, X = unknown> {
  private _repository: Z;

  constructor(repository: Z) {
    this._repository = repository;
  }

  protected get repository(): Z {
    return this._repository;
  }

  async execute(_data: T, ..._params: X[]): Promise<U> {
    return new Promise((resolve) => {
      resolve(undefined as U);
    });
  }
}
