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
          classic: 3,
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
          {
            sku: 'classic',
            type: 'buyXDiscountX',
            discountAmount: 249.99,
            buyAmount: 3,
          },
        ],
      }),
    ).toEqual({ total: 2821.91, discountAmount: 392.99 });
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

  it('should not get any free classic because no standout is added to cart', () => {
    expect(
      calculateTotal({
        cartItems: { classic: 1 },
        pricingRules: [
          {
            sku: 'classic',
            type: 'getYWithX',
            xSku: 'standout',
          },
        ],
      }),
    ).toStrictEqual({ total: 269.99, discountAmount: 0 });
  });

  it('should pick the highest percentage discount on top of fixed discount', () => {
    expect(
      calculateTotal({
        cartItems: { classic: 1 },
        pricingRules: [
          {
            sku: 'classic',
            type: 'percentage',
            percentage: 10,
          },
          {
            sku: 'classic',
            type: 'percentage',
            percentage: 50,
          },
          { sku: 'classic', type: 'fixed', amount: 100 },
        ],
      }),
    ).toStrictEqual({ total: 50, discountAmount: 219.99 });
  });

  it('should calculate total with 5 for the price of 4 and get classic free with every standout', () => {
    expect(
      calculateTotal({
        cartItems: { classic: 5, standout: 5 },
        pricingRules: [
          {
            sku: 'classic',
            type: 'getYWithX',
            xSku: 'standout',
          },
          {
            sku: 'standout',
            type: 'buyXFreeX',
            buyQuantity: 5,
            freeQuantity: 1,
          },
        ],
      }),
    ).toStrictEqual({ total: 1291.96, discountAmount: 1672.94 });
  });

  it('should use higher percentage discount over 5 for the price of 3', () => {
    expect(
      calculateTotal({
        cartItems: { standout: 5 },
        pricingRules: [
          {
            sku: 'standout',
            type: 'buyXFreeX',
            buyQuantity: 5,
            freeQuantity: 2,
          },
          { sku: 'standout', type: 'percentage', percentage: 70 },
        ],
      }),
    ).toStrictEqual({ total: 484.49, discountAmount: 1130.46 });
  });

  it('should discount premium ad to $379.99 when buying 4 or more premium ads', () => {
    expect(
      calculateTotal({
        cartItems: { premium: 5 },
        pricingRules: [
          {
            sku: 'premium',
            type: 'buyXDiscountX',
            discountAmount: 379.99,
            buyAmount: 4,
          },
        ],
      }),
    ).toStrictEqual({ total: 1899.95, discountAmount: 75 });
  });
});
