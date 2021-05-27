import { useEffect, useState } from 'react';

import { pricingRules } from 'src/App/dummyData';

import { Sku } from '../Product';

import calculateTotal from './calculateTotal';

const useCheckout = () => {
  const [customer, setCustomer] = useState<string>('');
  const [cart, setCart] = useState<{ total: number; discountAmount: number }>({
    total: 0,
    discountAmount: 0,
  });
  const [cartItems, setCartItems] = useState<Partial<Record<Sku, number>>>({});

  const addToCart = (sku: Sku) => {
    setCartItems((prevState) => ({
      ...prevState,
      [sku]: (prevState[sku] || 0) + 1,
    }));
  };

  useEffect(() => {
    setCart(
      calculateTotal({
        cartItems,
        pricingRules: pricingRules[customer],
      }),
    );
  }, [cartItems, customer]);

  return {
    add: addToCart,
    cart,
    cartItems,
    clear: () => setCartItems({}),
    setCustomer,
    customer,
  };
};

export default useCheckout;
