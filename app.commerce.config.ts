import { defineConfig } from '@adobe/aio-commerce-lib-app/config';

export default defineConfig({
  metadata: {
    id: 'customer-save-processor',
    displayName: 'Customer Save Processor',
    description: 'Processes Adobe Commerce customer save events and logs processed customer details for verification.',
    version: '1.0.0',
  },
  eventing: {
    commerce: [
      {
        provider: {
          label: 'Commerce Events Provider',
          description: 'Processes Adobe Commerce customer save events.',
        },
        events: [
          {
            name: 'observer.customer_save_commit_after',
            label: 'Customer Save Commit After',
            description: 'Triggered after an Adobe Commerce customer record is committed.',
            fields: [
              { name: 'id' },
              { name: 'email' },
              { name: 'firstname' },
              { name: 'lastname' },
            ],
            runtimeActions: ['my-app/process-customer'],
          },
        ],
      },
    ],
  },
});
