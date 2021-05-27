import { products } from '../../dummyData';
import { Sku } from '../Product';

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

const getTotalWithPricingRules = ({
  skus,
  pricingRules,
}: {
  skus: Sku[];
  pricingRules: PricingRule[];
}) => {
  const uniqueSkuItemsNum = skus.reduce(
    (acc, sku) => ({ ...acc, [sku]: (acc[sku] || 0) + 1 }),
    {} as Record<Sku, number>,
  );

  let totalPrice = 0;

  Object.keys(uniqueSkuItemsNum).forEach((sku) => {
    const pricingRule = pricingRuleQuery(pricingRules, sku as Sku);
    const skuQantity = uniqueSkuItemsNum[sku as Sku];

    switch (pricingRule?.discount.discountType) {
      case 'fixed':
        totalPrice +=
          pricingRule.discount.amount * uniqueSkuItemsNum[sku as Sku];
        break;
      case 'percentage':
        totalPrice += totalPrice +=
          (pricingRule.product.price -
            pricingRule.product.price *
              (pricingRule.discount.percentage / 100)) *
          skuQantity;
        break;
      case 'buyXFreeX':
        totalPrice +=
          pricingRule.product.price *
          (skuQantity -
            Math.floor(skuQantity / pricingRule.discount.buyQuantity));
        break;
      default:
        totalPrice +=
          (products?.find(({ sku: productSku }) => productSku === sku)?.price ||
            0) * skuQantity;
        break;
    }
  });

  return totalPrice;
};

const calculateTotal = ({
  skus,
  pricingRules,
}: {
  skus: Sku[];
  pricingRules: PricingRule[];
}) => {
  const total = getTotalWithPricingRules({ skus, pricingRules });

  return total;
};

export default calculateTotal;