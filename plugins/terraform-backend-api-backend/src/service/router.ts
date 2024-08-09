import { PluginDatabaseManager } from '@backstage/backend-common';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import {
  LoggerService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Knex } from 'knex';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
  database: PluginDatabaseManager;
}

export async function applyDatabaseMigrations(knex: Knex): Promise<void> {
  const migrationsDir = resolvePackagePath(
    `@internal/backstage-plugin-terraform-backend-api-backend`,
    'migrations',
  );

  await knex.migrate.latest({
    directory: migrationsDir,
  });
}
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, database } = options;

  const dbClient = await database.getClient();
  await applyDatabaseMigrations(dbClient);

  const router = Router();
  router.use(express.json());

  // Create a new playground
  router.post('/create-playground', async (req, res) => {
    const { name, items, webhook, backend, accessKey } = req.body;

    try {
      await dbClient('playground').insert({
        name,
        items: JSON.stringify(items),
        webhook,
        backend,
        access_key: accessKey,
      });

      res.status(201).json({ message: 'Playground created successfully' });
    } catch (error: any) {
      logger.error('Error creating playground:', error);
      res.status(500).json({ message: 'Failed to create playground' });
    }
  });

  router.get('/get-playground-data', async (req, res) => {
    const { name } = req.query;

    try {
      const playground = await dbClient('playground').where({ name }).first();

      if (!playground) {
        return res.status(404).json({ message: 'Playground not found' });
      }

      res.status(200).json({
        name: playground.name,
        items: JSON.parse(playground.items),
        webhook: playground.webhook,
        backend: playground.backend,
        accessKey: playground.access_key,
      });
    } catch (error: any) {
      logger.error('Error fetching playground data:', error);
      res.status(500).json({ message: 'Failed to fetch playground data' });
    }
  });

  router.post('/save-playground', async (req, res) => {
    const { name, items, webhook, backend, accessKey } = req.body;

    try {
      await dbClient('playground')
        .where({ name })
        .update({
          items: JSON.stringify(items),
          webhook,
          backend,
          access_key: accessKey,
        });

      res.status(200).json({ message: 'Playground saved successfully' });
    } catch (error: any) {
      logger.error('Error saving playground:', error);
      res.status(500).json({ message: 'Failed to save playground' });
    }
  });

  router.get('/get-playgrounds', async (req, res) => {
    try {
      const playgrounds = await dbClient('playground').select('name');
      res.status(200).json(playgrounds);
    } catch (error: any) {
      logger.error('Error fetching playgrounds:', error);
      res.status(500).json({ message: 'Failed to fetch playgrounds' });
    }
  });

  const middleware = MiddlewareFactory.create({ logger, config });
  router.use(middleware.error());

  return router;
}
