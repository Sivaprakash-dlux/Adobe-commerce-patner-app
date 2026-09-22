export function transformCustomer(customer) {
  const fullName = `${customer.firstname} ${customer.lastname}`;

  return {
    customerId: customer.id,
    fullName,
    email: customer.email,
    customerType: 'new-commerce-customer',
    processed: true,
  };
}
