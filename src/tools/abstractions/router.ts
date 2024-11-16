import express from 'express';
import type AbstractController from './controller.js';

export default abstract class AbstractRouter<T, U, Z> {
  private readonly _router: express.Router;
  private readonly _controller: AbstractController<U, T, Z>;

  constructor(controller: AbstractController<U, T, Z>) {
    this._router = express.Router();
    this._controller = controller;
  }

  get router(): express.Router {
    return this._router;
  }

  protected get controller(): AbstractController<U, T, Z> {
    return this._controller;
  }

  async execute(_req: express.Request<unknown, unknown, unknown, unknown>): Promise<T> {
    return new Promise((resolve) => {
      resolve(undefined as T);
    });
  }
}
