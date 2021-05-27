import { useEffect, useState } from 'react';

import Product from '../Product';

import calculateTotal from './calculateTotal';

const useCheckout = () => {
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prevState) => [...prevState, product]);
  };

  useEffect(() => {
    setTotal(
      calculateTotal({
        skus: cartItems.map(({ sku }) => sku),
        pricingRules: [
          {
            sku: 'classic',
            discount: {
              discountType: 'buyXFreeX',
              buyQuantity: 5,
              freeQuantity: 1,
            },
          },
        ],
      }),
    );
  }, [cartItems]);

  return { add: addToCart, total, cartItems, clear: () => setCartItems([]) };
};

export default useCheckout;
