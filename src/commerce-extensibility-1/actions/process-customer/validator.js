export function getMissingCustomerFields(customer) {
  const missingFields = [];

  if (!customer || !customer.email) missingFields.push('email');
  if (!customer || !customer.firstname) missingFields.push('firstname');
  if (!customer || !customer.lastname) missingFields.push('lastname');

  return missingFields;
}
