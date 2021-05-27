import calculateTotal from './calculateTotal';

describe('calculateTotal', () => {
  // default user
  it('should calculate total without discounts', () => {
    expect(
      calculateTotal({
        skus: ['classic', 'standout', 'premium'],
        pricingRules: [],
      }).total,
    ).toEqual(987.97);
  });

  // SecondBite
  it('should calculate total with 3 for 2 (1 free) discount', () => {
    expect(
      calculateTotal({
        skus: ['classic', 'classic', 'classic', 'premium'],
        pricingRules: [
          {
            sku: 'classic',
            discount: {
              discountType: 'buyXFreeX',
              buyQuantity: 3,
              freeQuantity: 1,
            },
          },
        ],
      }).total,
    ).toEqual(934.97);
  });

  // Axil Coffee Roasters
  it('should calculate total with fixed discount', () => {
    expect(
      calculateTotal({
        skus: ['standout', 'standout', 'standout', 'premium'],
        pricingRules: [
          {
            sku: 'standout',
            discount: { discountType: 'fixed', amount: 299.99 },
          },
        ],
      }).total,
    ).toEqual(1294.96);
  });

  // MYER
  it('should calculate total with 5 for 4 (1 free) and fixed discount', () => {
    expect(
      calculateTotal({
        skus: [
          'standout',
          'standout',
          'standout',
          'standout',
          'standout',
          'premium',
          'premium',
        ],
        pricingRules: [
          {
            sku: 'standout',
            discount: {
              discountType: 'buyXFreeX',
              buyQuantity: 5,
              freeQuantity: 1,
            },
          },
          {
            sku: 'premium',
            discount: {
              discountType: 'fixed',
              amount: 389.99,
            },
          },
        ],
      }).total,
    ).toEqual(2071.94);
  });

  // Other tests
  it('should calculate total with percentage discount', () => {
    expect(
      calculateTotal({
        skus: ['standout', 'standout', 'standout'],
        pricingRules: [
          {
            sku: 'standout',
            discount: {
              discountType: 'percentage',
              percentage: 100,
            },
          },
        ],
      }).total,
    ).toEqual(0);
  });

  it('should calculate total with percentage, fixed, and 10 for 6 (4 free) discount', () => {
    expect(
      calculateTotal({
        skus: [
          'classic',
          'standout',
          'premium',
          'premium',
          'premium',
          'premium',
          'premium',
          'premium',
          'premium',
          'premium',
          'premium',
          'premium',
        ],
        pricingRules: [
          {
            sku: 'classic',
            discount: {
              discountType: 'fixed',
              amount: 30,
            },
          },
          {
            sku: 'standout',
            discount: {
              discountType: 'percentage',
              percentage: 100,
            },
          },
          {
            sku: 'premium',
            discount: {
              discountType: 'buyXFreeX',
              buyQuantity: 10,
              freeQuantity: 4,
            },
          },
        ],
      }).total,
    ).toEqual(2399.94);
  });

  it('should not give any discounts due to buy quantity - buy 3 for 2', () => {
    expect(
      calculateTotal({
        skus: ['classic', 'classic'],
        pricingRules: [
          {
            sku: 'classic',
            discount: {
              discountType: 'buyXFreeX',
              buyQuantity: 3,
              freeQuantity: 1,
            },
          },
        ],
      }).total,
    ).toEqual(539.98);
  });

  it('should give 10% discount on classic sku', () => {
    expect(
      calculateTotal({
        skus: ['classic'],
        pricingRules: [
          {
            sku: 'classic',
            discount: {
              discountType: 'percentage',
              percentage: 10,
            },
          },
        ],
      }).total,
    ).toEqual(242.991);
  });
});
