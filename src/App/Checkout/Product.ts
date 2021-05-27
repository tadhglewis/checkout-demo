export type Sku = 'classic' | 'standout' | 'premium';

type Product = {
  id: string;
  sku: Sku;
  price: number;
  title: string;
  description: string;
};

export default Product;
