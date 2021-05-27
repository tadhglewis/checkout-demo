import { useEffect, useState } from 'react';

import { pricingRules } from 'src/App/dummyData';

import Product from '../Product';

import calculateTotal from './calculateTotal';

const useCheckout = () => {
  const [customer, setCustomer] = useState<string>('');
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prevState) => [...prevState, product]);
  };

  useEffect(() => {
    setTotal(
      calculateTotal({
        skus: cartItems.map(({ sku }) => sku),
        pricingRules: pricingRules[customer],
      }),
    );
  }, [cartItems, customer]);

  return {
    add: addToCart,
    total,
    cartItems,
    clear: () => setCartItems([]),
    setCustomer,
    customer,
  };
};

export default useCheckout;
