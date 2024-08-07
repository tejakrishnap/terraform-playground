import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

/**
 * terraformBackendApiPlugin backend plugin
 *
 * @public
 */
export const terraformBackendApiPlugin = createBackendPlugin({
  pluginId: 'terraform-backend-api',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        database: coreServices.database,
      },
      async init({
        httpRouter,
        logger,
        config,
        database,
      }) {
        httpRouter.use(
          await createRouter({
            logger,
            config,
            database,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/save-terraform',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/save-playground',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/playground',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
