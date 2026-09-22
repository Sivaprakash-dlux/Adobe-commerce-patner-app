import { getMissingCustomerFields } from './validator.js';
import { transformCustomer } from './transformer.js';

function buildSuccessLogLines(customer, transformed) {
  return [
    'Commerce customer event received',
    `Customer ID: ${customer.id}`,
    `Full Name: ${transformed.fullName}`,
    `Email: ${transformed.email}`,
    `Customer Type: ${transformed.customerType}`,
    `Processed: ${transformed.processed}`,
  ];
}

function buildFailureLogLines(customerId, missingFields) {
  return [
    'Commerce customer event received',
    `Customer ID: ${customerId ?? 'unknown'}`,
    `Missing Fields: ${missingFields.join(', ')}`,
    'Processed: false',
  ];
}

export async function main(params) {
  try {
    const customer = params?.data?.value;
    const customerId = customer?.id;
    const missingFields = getMissingCustomerFields(customer);

    if (missingFields.length > 0) {
      console.log(buildFailureLogLines(customerId, missingFields).join('\n'));
      return {
        statusCode: 400,
        body: { processed: false, customerId, missingFields },
      };
    }

    const transformed = transformCustomer(customer);
    console.log(buildSuccessLogLines(customer, transformed).join('\n'));

    return {
      statusCode: 200,
      body: transformed,
    };
  } catch (error) {
    console.error('process-customer unexpected error', {
      customerId: params?.data?.value?.id,
      message: error?.message,
    });

    return {
      statusCode: 500,
      body: { processed: false, error: 'Internal Server Error' },
    };
  }
}
