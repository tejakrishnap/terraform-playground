import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import fs from 'fs';
import path from 'path';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.post('/save-playground', async (req, res) => {
    const { name, items } = req.body;
    if (!name || !items) {
      res.status(400).json({ error: 'Name and items are required' });
      return;
    }

    const directoryPath = path.resolve(__dirname, '../../../../playgrounds');
    const filePath = path.join(directoryPath, `${name}.json`);

    try {
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      fs.writeFile(filePath, JSON.stringify({ items }), (err) => {
        if (err) {
          console.error('Failed to save file', err);
          res.status(500).json({ error: 'Failed to save file' });
        } else {
          res.status(200).json({ message: 'Playground saved successfully' });
        }
      });
    } catch (err) {
      console.error('Unexpected error occurred', err);
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
  });

  router.get('/playground', async (req, res) => {
    const { name } = req.query;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const filePath = path.resolve(__dirname, '../../../../playgrounds', `${name}.json`);

    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        res.status(200).json(JSON.parse(data));
      } else {
        res.status(404).json({ error: 'Playground not found' });
      }
    } catch (err) {
      console.error('Unexpected error occurred', err);
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
  });

  router.post('/save-terraform', async (req, res) => {
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const directoryPath = path.resolve(__dirname, '../../../../generated');
    const filePath = path.join(directoryPath, 'terraform.tf');

    try {
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      fs.writeFile(filePath, content, (err) => {
        if (err) {
          console.error('Failed to save file', err);
          res.status(500).json({ error: 'Failed to save file' });
        } else {
          res.status(200).json({ message: 'File saved successfully' });
        }
      });
    } catch (err) {
      console.error('Unexpected error occurred', err);
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
  });

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());
  return router;
}
