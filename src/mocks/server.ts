import { createServer, RestSerializer } from 'miragejs';
import { models } from './models';
import { setupClassRoutes } from './routes/classRoute';
import { seedDatabase } from './seeds';
import { setupSchoolRoutes } from './routes/schoolRoute';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,
    models,

    serializers: {
      application: RestSerializer.extend({
        serializeIds: 'always',
        embed: true,
        root: true,
      }),
    },

    seeds(server) {
      seedDatabase(server);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750;

      setupSchoolRoutes(this);
      setupClassRoutes(this);

      this.passthrough();
    },
  });
}
