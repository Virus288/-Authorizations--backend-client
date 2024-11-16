import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import rateLimit from './utils/index.js';
import { FourOhFour } from '../../errors/index.js';
import initUserRoutes from './modules/user/index.js';
import handleErr from '../../errors/handler.js';
import State from '../../tools/state.js';
import type { Router } from 'express';
import type swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';

export default class AppRouter {
  private readonly _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  private get router(): Router {
    return this._router;
  }

  /*
   * Init unprotected routes.
   */
  initRoutes(): void {
    initUserRoutes(this.router);
  }

  initHealh(): void {
    this.router.get('/health', (_req, res) => {
      const { alive } = State;

      alive ? res.sendStatus(200) : res.sendStatus(500);
    });
  }

  initFourOhFour(): void {
    this.router.all('*', rateLimit, (_req, res) => {
      handleErr(new FourOhFour(), res);
    });
  }

  generateDocumentation(): void {
    const jsonPackage = JSON.parse(fs.readFileSync('package.json').toString()) as Record<string, string>;
    const options: swaggerJsdoc.Options = {
      definition: {
        openapi: '3.0.1',
        description: 'This is a REST API for template application',
        servers: [
          {
            url: 'http://localhost',
            description: 'Development server',
          },
        ],
        info: {
          title: 'Template app API doc',
          version: jsonPackage.version as string,
        },
        component: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      apis: ['./src/errors/index.ts', './scr/errors/index.js'],
    };

    const swaggerSpec = swaggerJSDoc(options);
    this.router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.router.get('docs.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }
}
