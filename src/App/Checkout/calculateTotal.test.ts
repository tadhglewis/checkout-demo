import calculateTotal from './calculateTotal';

describe('calculateTotal', () => {
  // default user
  it('should calculate total without discounts', () => {
    expect(
      calculateTotal({
        skus: ['classic', 'standout', 'premium'],
        pricingRules: [],
      }),
    ).toEqual(987.97);
  });

  // SecondBite
  it('should calculate total with buy x get x free discount', () => {
    expect(
      calculateTotal({
        skus: ['classic', 'classic', 'classic', 'premium'],
        pricingRules: [
          {
            sku: 'classic',
            discount: {
              discountType: 'buyXFreeX',
              buyQuantity: 2,
              freeQuantity: 1,
            },
          },
        ],
      }),
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
      }),
    ).toEqual(1294.96);
  });

  //   it('should calculate total with fixed and buy x get x free discount', () => {
  //     expect(
  //       calculateTotal({
  //         skus: ['standout', 'standout', 'standout', 'premium'],
  //         pricingRules: [
  //           {
  //             sku: 'standout',
  //             discount: {
  //               discountType: 'buyXFreeX',
  //               buyQuantity: 4,
  //               freeQuantity: 5,
  //             },
  //           },
  //           {
  //             sku: 'premium',
  //             discount: { discountType: 'fixed', amount: 389.99 },
  //           },
  //         ],
  //       }),
  //     ).toEqual(1294.96);
  //   });
});
