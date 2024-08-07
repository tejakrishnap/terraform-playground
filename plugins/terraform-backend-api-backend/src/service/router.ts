import { PluginDatabaseManager } from '@backstage/backend-common';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { LoggerService, resolvePackagePath } from '@backstage/backend-plugin-api';
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
    directory: migrationsDir
  })
}
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, database } = options;

  const dbClient = await database.getClient();
  await applyDatabaseMigrations(dbClient);

  const router = Router();
  router.use(express.json());

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());

  // Create a new playground
  router.post('/playgrounds', async (req, res) => {
    const { name, items, webhook, backend, accessKey } = req.body;
    try {
      await dbClient('playground').insert({
        name,
        items: JSON.stringify(items),
        webhook,
        backend,
        access_key: accessKey,
      });
      res.status(201).send('Playground created');
    } catch (error) {
      res.status(500).json({ error: 'Failed to create playground' });
    }
  });

  // Get all playgrounds
  router.get('/playgrounds', async (req, res) => {
    try {
      const playgrounds = await dbClient('playground').select('*');
      const formattedPlaygrounds = playgrounds.map(pg => ({
        ...pg,
        items: JSON.parse(pg.items),
      }));
      res.status(200).json(formattedPlaygrounds);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch playgrounds' });
    }
  });

  // Get a single playground by name
  router.get('/playgrounds/:name', async (req, res) => {
    const { name } = req.params;
    try {
      const playground = await dbClient('playground').where({ name }).first();
      if (!playground) {
        return res.status(404).json({ error: 'Playground not found' });
      }
      res.status(200).json({ ...playground, items: JSON.parse(playground.items) });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch playground' });
    }
  });

  // Update a playground
  router.put('/playgrounds/:name', async (req, res) => {
    const { name } = req.params;
    const { items, webhook, backend, accessKey } = req.body;
    try {
      const updated = await dbClient('playground')
        .where({ name })
        .update({
          items: JSON.stringify(items),
          webhook,
          backend,
          access_key: accessKey,
        });
      if (!updated) {
        return res.status(404).json({ error: 'Playground not found' });
      }
      res.status(200).send('Playground updated');
    } catch (error) {
      res.status(500).json({ error: 'Failed to update playground' });
    }
  });

  // Delete a playground
  router.delete('/playgrounds/:name', async (req, res) => {
    const { name } = req.params;
    try {
      const deleted = await dbClient('playground').where({ name }).del();
      if (!deleted) {
        return res.status(404).json({ error: 'Playground not found' });
      }
      res.status(200).send('Playground deleted');
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete playground' });
    }
  });

  return router;
}
