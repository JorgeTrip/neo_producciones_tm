import { describe, it } from 'node:test';
import assert from 'node:assert';
import { manejarPeticionWebhook } from '../../netlify/functions/webhook-meta.js';

describe('Webhook Serverless Netlify - Handler', () => {
  it('responde 200 con el challenge cuando el token de verificación coincide en GET', async () => {
    process.env.WEBHOOK_VERIFY_TOKEN = 'token_test_123';
    const request = new Request(
      'https://neoproduccionestm.netlify.app/.netlify/functions/webhook-meta?hub.mode=subscribe&hub.verify_token=token_test_123&hub.challenge=CHALLENGE_OK',
      { method: 'GET' }
    );

    const respuesta = await manejarPeticionWebhook(request);
    assert.strictEqual(respuesta.status, 200);
    const body = await respuesta.text();
    assert.strictEqual(body, 'CHALLENGE_OK');
  });

  it('responde 403 cuando el token de verificación es inválido en GET', async () => {
    process.env.WEBHOOK_VERIFY_TOKEN = 'token_test_123';
    const request = new Request(
      'https://neoproduccionestm.netlify.app/.netlify/functions/webhook-meta?hub.mode=subscribe&hub.verify_token=token_falso&hub.challenge=CHALLENGE_OK',
      { method: 'GET' }
    );

    const respuesta = await manejarPeticionWebhook(request);
    assert.strictEqual(respuesta.status, 403);
  });
});
