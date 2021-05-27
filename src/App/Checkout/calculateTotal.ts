import { products } from '../dummyData';

import { Sku } from './Product';

type FixedDiscount = {
  discountType: 'fixed';
  amount: number;
};

type PercentageDiscount = {
  discountType: 'percentage';
  percentage: number;
};

type BuyXGetXFree = {
  discountType: 'buyXFreeX';
  freeQuantity: number;
  buyQuantity: number;
};

type Discount = FixedDiscount | PercentageDiscount | BuyXGetXFree;

type PricingRule = {
  sku: Sku;
  discount: Discount;
};

// In the real world, you would probably want this backend and a graphql query that looks something like this to be consumed in the front end

// `
// query getPricingRule {
//   getPricingRule(sku: ["classic", "standout", "premium"]) {
//     sku
//     discount {
//       ... on FixedDiscount {
//         discountType
//         amount
//       }

//       ... on PercentageDiscount {
//         discountType
//         percentage
//       }

//       ... on BuyXGetXFree {
//         discountType
//         freeQuantity
//         buyQuantity
//       }
//     }
//     product {
//       ...
//     }
//   }
// }
// `

// for this demo, we just use a function

const pricingRuleQuery = (pricingRules: PricingRule[], sku: Sku) => {
  const pricingRule = pricingRules.find(
    ({ sku: pricingRuleSku }) => sku === pricingRuleSku,
  );
  const product = products.find(({ sku: productSku }) => productSku === sku);

  if (!product || !pricingRule) {
    return null;
  }

  return { ...pricingRule, product };
};

const getAmountWithPriceRule = ({
  sku,
  pricingRules,
}: {
  sku: Sku;
  pricingRules: PricingRule[];
}) => {
  const pricingRule = pricingRuleQuery(pricingRules, sku);
  if (!pricingRule) {
    return 0;
  }

  switch (pricingRule.discount.discountType) {
    case 'fixed':
      return pricingRule.discount.amount;
    case 'percentage':
      return (
        pricingRule.product.price -
        pricingRule.product.price * (pricingRule.discount.percentage / 100)
      );
    case 'buyXFreeX':
      return 0;
  }
};

const calculateTotal = ({
  skus,
  pricingRules,
}: {
  skus: Sku[];
  pricingRules: PricingRule[];
}) => {
  const total: number = skus.reduce((previousTotal, sku) => {
    let currentTotal = previousTotal;
    const price = getAmountWithPriceRule({ sku, pricingRules });

    if (price) {
      currentTotal = currentTotal + price;
    }

    return currentTotal;
  }, 0);

  return total;
};

export default calculateTotal;
