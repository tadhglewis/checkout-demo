import Product from './Checkout/Product';

// You'd use a GraphQL endpint to get products and query/filter them - for simplicity we defined an object
export const products: Product[] = [
  {
    id: '1',
    sku: 'classic',
    title: 'Clasic',
    description: 'Offers the most basic level of advertisement',
    price: 269.99,
  },
  {
    id: '2',
    sku: 'standout',

    title: 'Stand out',
    description:
      'Allows advertisers to use a company logo and use a longer presentation text',
    price: 322.99,
  },
  {
    id: '3',
    sku: 'premium',
    title: 'Premium',
    description:
      'Same benefits as Standout Ad, but also puts the advertisement at the top of the results, allowing higher visibility',
    price: 394.99,
  },
];
