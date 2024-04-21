import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { readdir, readFile, lstat } from 'node:fs/promises';
import { Layout } from './Layout';
import { basicAuth } from 'hono/basic-auth';
import assert from 'node:assert';

export const app = new Hono();

assert(process.env.username !== undefined, 'username is missing.');
assert(process.env.password !== undefined, 'password is missing.');

app.use(
  '/static/*',
  serveStatic({
    root: './',
    onNotFound: (c) => {
      console.log(c);
    },
    // rewriteRequestPath: (path) => path.replace(/^\/static/, ""),
  }),
);

app.get(
  '/',
  basicAuth({
    username: process.env.username,
    password: process.env.password,
  }),
  async (c) => {
    try {
      const q = c.req.query('q') ?? '';

      const basePath = process.env.source_path ?? '/app/source';
      const path = `${basePath}/${q}`;
      const stat = await lstat(path);

      if (stat.isFile()) {
        const content = await readFile(path);

        return c.html(
          <Layout title={q} description={''} image={''}>
            <pre>
              {/* class='whitespace-pre-wrap' */}
              <code>{content.toString()}</code>
            </pre>
          </Layout>,
        );
      }

      const files = await readdir(path);

      return c.html(
        <Layout title={'index'} description={''} image={''}>
          {/* <div class='w-dvw'>class="w-dvw"</div> */}
          <div class='px-2 py-1 text-lg block '>pwd: {q === '' ? '/' : q}</div>
          <div class={'flex flex-col divide-y mt-2'}>
            {files.map((i) => (
              <a class={'px-2 py-1 block text-lg break-all'} href={`/?q=${`${q}/${i}`}`}>
                {i}
              </a>
            ))}
          </div>
        </Layout>,
      );
    } catch (err) {
      console.error(err);
    }
  },
);
