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
import axios from 'axios';
import dotenv from 'dotenv';
import hclToJson from 'hcl-to-json';
import fs from 'fs';
import path from 'path';

dotenv.config();

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
  // const gitlabFileUrl = 'https://gitlab.example.com/api/v4/projects/60559076/terraform-modules/-/raw/main/alb/variables.tf?ref=main';
  const gitlabToken = process.env.GITLAB_TOKEN;
  const projectId = '60559076';
  const filePath = '-/raw/main/alb/variables.tf';
  const ref = 'main'; 

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
      if (!name || !items || !Array.isArray(items)) {
        throw new Error('Invalid payload');
      }

      const result = await dbClient('playground')
        .where({ name })
        .update({
          items: JSON.stringify(items),
          webhook,
          backend,
          access_key: accessKey,
        });

      if (result === 0) {
        throw new Error('No rows updated');
      }
  
      res.status(200).json({ message: 'Playground saved successfully' });
    } catch (error: any) {
      logger.error('Error saving playground:', {
        message: error.message,
        stack: error.stack,
      });
      res.status(500).json({ message: 'Failed to save playground', error: error.message });
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

  router.post('/get-variable-data', async (req, res) => {
    try {
      const { serviceKey } = req.body;
      const filePath = path.resolve(__dirname, '../templates/variables.json');
      const rawData = fs.readFileSync(filePath);
      const terraformData = JSON.parse(rawData);
  
      if (!serviceKey) {
        return res.status(400).json({ message: 'Service key is required' });
      }
  
      const serviceData = terraformData[serviceKey];

      console.log(serviceData);
  
      if (!serviceData) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      const response = {
        inputs: {},
        outputs: {}
      };
    
      for (const [key, value] of Object.entries(serviceData)) {
        if (key === 'inputs') {
          response.inputs = value;
        } else if (key === 'outputs') {
          response.outputs = value;
        }
      }
  
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching variable data:', error);
      res.status(500).json({ message: 'Failed to fetch variable data' });
    }
  });
  
  // const fetchTerraformData = async () => {
  //   const rawData = `
  //     variable "infra_env" {
  //       type = string
  //       description = "infrastructure environment"
  //     }
  //     variable "infra_role" {
  //       type = string
  //       description = "infrastructure purpose"
  //     }
  //     variable "instance_size" {
  //       type = string
  //       description = "ec2 web server size"
  //       default = "t3.small"
  //     }
  //     variable "instance_ami" {
  //       type = string
  //       description = "Server image to use"
  //     }
  //     variable "instance_root_device_size" {
  //       type = number
  //       description = "Root block device size in GB"
  //       default = 12
  //     }
  //   `;

  //   return rawData;
  // }

  const middleware = MiddlewareFactory.create({ logger, config });
  router.use(middleware.error());

  return router;
}
