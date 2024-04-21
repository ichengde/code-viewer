import { serve } from '@hono/node-server';
import { app } from './main';

const port = 3000

serve({
  fetch: app.fetch,
  port
})

console.log(`Service is running, port ${port}`)