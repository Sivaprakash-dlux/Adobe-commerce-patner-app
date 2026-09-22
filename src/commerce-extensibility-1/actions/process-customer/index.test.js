import assert from 'node:assert/strict';
import { main } from './index.js';

const originalLog = console.log;
const originalError = console.error;

function captureConsole() {
  const logs = [];
  const errors = [];
  console.log = (...args) => logs.push(args.join(' '));
  console.error = (...args) => errors.push(args.join(' '));
  return { logs, errors };
}

try {
  const { logs } = captureConsole();
  const response = await main({
    data: {
      value: {
        id: 100245,
        email: 'john.doe@example.com',
        firstname: 'John',
        lastname: 'Doe',
      },
    },
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    customerId: 100245,
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    customerType: 'new-commerce-customer',
    processed: true,
  });
  assert.equal(logs.join('\n').includes('Commerce customer event received'), true);
  assert.equal(logs.join('\n').includes('Customer ID: 100245'), true);
  assert.equal(logs.join('\n').includes('Full Name: John Doe'), true);
  assert.equal(logs.join('\n').includes('Email: john.doe@example.com'), true);
  assert.equal(logs.join('\n').includes('Customer Type: new-commerce-customer'), true);
  assert.equal(logs.join('\n').includes('Processed: true'), true);

  const validationCapture = captureConsole();
  const validationResponse = await main({
    data: { value: { id: 100245, email: 'john.doe@example.com', firstname: 'John' } },
  });

  assert.equal(validationResponse.statusCode, 400);
  assert.deepEqual(validationResponse.body, {
    processed: false,
    customerId: 100245,
    missingFields: ['lastname'],
  });
  assert.equal(validationCapture.logs.join('\n').includes('Missing Fields: lastname'), true);
  assert.equal(validationCapture.logs.join('\n').includes('Processed: false'), true);

  const errorCapture = captureConsole();
  const errorResponse = await main({
    data: {
      value: {
        id: 100245,
        email: 'john.doe@example.com',
        firstname: 'John',
        lastname: 'Doe',
      },
    },
    get data() {
      throw new Error('boom');
    },
  });

  assert.equal(errorResponse.statusCode, 500);
  assert.deepEqual(errorResponse.body, { processed: false, error: 'Internal Server Error' });
  assert.equal(errorCapture.errors.join('\n').includes('process-customer unexpected error'), true);
} finally {
  console.log = originalLog;
  console.error = originalError;
}
