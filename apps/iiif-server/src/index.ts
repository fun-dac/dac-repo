import { createReadStream } from 'fs';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { IIIFError, Processor } from 'iiif-processor';

// NOTE: 仮のソース画像ディレクトリ。将来的にはストレージ抽象化に置き換える
const IMAGE_DIR = './data';

const streamResolver = async ({ id }: { id: string }) => {
  return createReadStream(`${IMAGE_DIR}/${id}`);
};

const app = new Hono();

app.get('/iiif/:version{[23]}/*', async (c) => {
  const processor = new Processor(c.req.url, streamResolver, {
    pathPrefix: '/iiif/{{version}}/',
  });

  try {
    const result = await processor.execute();

    switch (result.type) {
      case 'content':
        return c.body(result.body, {
          headers: { 'Content-Type': result.contentType },
        });
      case 'redirect':
        return c.redirect(result.location, 302);
      case 'error':
        return Response.json(
          { error: result.message },
          { status: result.statusCode },
        );
    }
  } catch (error) {
    const status = error instanceof IIIFError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: status ?? 500 });
  }
});

const port = 34252;

serve({ fetch: app.fetch, port }, (info) => {
  // eslint-disable-next-line no-console
  console.log(`IIIF server running on http://localhost:${info.port}`);
});
