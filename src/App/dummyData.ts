import Product from './Checkout/Product';
import { PricingRule } from './Checkout/useCheckout/calculateTotal';

// You'd use a GraphQL endpint to get products and query/filter them - for simplicity we defined an object
export const products: Product[] = [
  {
    id: '1',
    sku: 'classic',
    title: 'Classic',
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

export const pricingRules: Record<string, PricingRule[]> = {
  SecondBite: [
    {
      sku: 'classic',
      type: 'buyXFreeX',
      buyQuantity: 3,
      freeQuantity: 1,
    },
  ],
  'Axil Coffee Roasters': [
    {
      sku: 'standout',
      type: 'fixed',
      amount: 299.99,
    },
  ],
  MYER: [
    {
      sku: 'standout',
      type: 'buyXFreeX',
      buyQuantity: 5,
      freeQuantity: 1,
    },
    {
      sku: 'premium',
      type: 'fixed',
      amount: 389.99,
    },
  ],
};
