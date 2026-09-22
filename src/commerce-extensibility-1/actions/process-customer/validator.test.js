import assert from 'node:assert/strict';
import { getMissingCustomerFields } from './validator.js';

const validCustomer = { email: 'john.doe@example.com', firstname: 'John', lastname: 'Doe' };

assert.deepEqual(getMissingCustomerFields(validCustomer), []);
assert.deepEqual(getMissingCustomerFields({ email: 'john.doe@example.com', firstname: 'John' }), ['lastname']);
assert.deepEqual(getMissingCustomerFields(null), ['email', 'firstname', 'lastname']);
