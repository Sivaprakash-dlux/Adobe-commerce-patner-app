import assert from 'node:assert/strict';
import { transformCustomer } from './transformer.js';

assert.deepEqual(
  transformCustomer({ id: 100245, email: 'john.doe@example.com', firstname: 'John', lastname: 'Doe' }),
  {
    customerId: 100245,
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    customerType: 'new-commerce-customer',
    processed: true,
  }
);
