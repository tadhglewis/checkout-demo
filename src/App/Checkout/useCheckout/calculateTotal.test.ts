import calculateTotal from './calculateTotal';

describe('calculateTotal', () => {
  // default user
  it('should calculate total without discounts', () => {
    expect(
      calculateTotal({
        cartItems: { classic: 1, standout: 1, premium: 1 },
        pricingRules: [],
      }),
    ).toStrictEqual({ total: 987.97, discountAmount: 0 });
  });

  // SecondBite
  it('should calculate total with 3 for 2 (1 free) discount', () => {
    expect(
      calculateTotal({
        cartItems: { classic: 3, premium: 1 },
        pricingRules: [
          {
            sku: 'classic',
            type: 'buyXFreeX',
            buyQuantity: 3,
            freeQuantity: 1,
          },
        ],
      }),
    ).toStrictEqual({ total: 934.97, discountAmount: 269.99 });
  });

  // Axil Coffee Roasters
  it('should calculate total with fixed discount', () => {
    expect(
      calculateTotal({
        cartItems: { standout: 3, premium: 1 },
        pricingRules: [
          {
            sku: 'standout',
            type: 'fixed',
            amount: 299.99,
          },
        ],
      }),
    ).toStrictEqual({ total: 1294.96, discountAmount: 69 });
  });

  // MYER
  it('should calculate total with 5 for 4 (1 free) and fixed discount', () => {
    expect(
      calculateTotal({
        cartItems: {
          standout: 5,
          premium: 2,
        },
        pricingRules: [
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
      }),
    ).toEqual({ total: 2071.94, discountAmount: 332.99 });
  });

  // Other tests
  it('should calculate total with percentage discount', () => {
    expect(
      calculateTotal({
        cartItems: { standout: 3 },
        pricingRules: [
          {
            sku: 'standout',
            type: 'percentage',
            percentage: 100,
          },
        ],
      }),
    ).toStrictEqual({ total: 0, discountAmount: 968.97 });
  });

  it('should calculate total with percentage, fixed, and 10 for 6 (4 free) discount', () => {
    expect(
      calculateTotal({
        cartItems: {
          classic: 1,
          standout: 1,
          premium: 10,
        },
        pricingRules: [
          {
            sku: 'classic',
            type: 'fixed',
            amount: 30,
          },
          {
            sku: 'standout',
            type: 'percentage',
            percentage: 100,
          },
          {
            sku: 'premium',
            type: 'buyXFreeX',
            buyQuantity: 10,
            freeQuantity: 4,
          },
        ],
      }),
    ).toStrictEqual({ total: 2399.94, discountAmount: 2142.94 });
  });

  it('should not give any discounts due to buy quantity - buy 3 for 2', () => {
    expect(
      calculateTotal({
        cartItems: { classic: 2 },
        pricingRules: [
          {
            sku: 'classic',
            type: 'buyXFreeX',
            buyQuantity: 3,
            freeQuantity: 1,
          },
        ],
      }),
    ).toStrictEqual({ total: 539.98, discountAmount: 0 });
  });

  it('should give 10% discount on classic sku', () => {
    expect(
      calculateTotal({
        cartItems: { classic: 1 },
        pricingRules: [
          {
            sku: 'classic',
            type: 'percentage',
            percentage: 10,
          },
        ],
      }),
    ).toStrictEqual({ total: 242.99, discountAmount: 27 });
  });

  it('should get classic free when buying standout', () => {
    expect(
      calculateTotal({
        cartItems: { standout: 2, classic: 1 },
        pricingRules: [
          {
            sku: 'classic',
            type: 'getYWithX',
            xSku: 'standout',
          },
        ],
      }),
    ).toStrictEqual({ total: 645.98, discountAmount: 269.99 });
  });
});
