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

export type PricingRule = {
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
  const product = productsQuery([sku])[0];

  if (!product || !pricingRule) {
    return null;
  }

  return { ...pricingRule, product };
};

const productsQuery = (skus: Sku[]) =>
  products.filter(({ sku }) => skus.includes(sku));

const getTotal = ({
  cartItems,
  pricingRules = undefined,
}: {
  cartItems: Partial<Record<Sku, number>>;
  pricingRules?: PricingRule[];
}) => {
  let totalPrice = 0;

  (Object.keys(cartItems) as Sku[]).forEach((sku) => {
    const pricingRule = pricingRules
      ? pricingRuleQuery(pricingRules, sku)
      : null;
    const skuQantity = cartItems[sku] || 0;

    // Abstract out into functions when this gets too long :)
    switch (pricingRule?.discount.discountType) {
      case 'fixed':
        totalPrice += pricingRule.discount.amount * skuQantity;
        break;
      case 'percentage':
        totalPrice +=
          (pricingRule.product.price -
            pricingRule.product.price *
              (pricingRule.discount.percentage / 100)) *
          skuQantity;
        break;
      case 'buyXFreeX':
        const quantityExcludingFree =
          skuQantity -
          Math.floor(
            (skuQantity / pricingRule.discount.buyQuantity) *
              pricingRule.discount.freeQuantity,
          );

        totalPrice += pricingRule.product.price * quantityExcludingFree;
        break;
      default:
        const productPrice = productsQuery([sku])[0].price;

        totalPrice += (productPrice || 0) * skuQantity;
        break;
    }
  });

  return totalPrice;
};

const calculateTotal = ({
  cartItems,
  pricingRules,
}: {
  cartItems: Partial<Record<Sku, number>>;
  pricingRules: PricingRule[];
}) => {
  const total = getTotal({ cartItems, pricingRules });

  const totalWithoutDiscount = getTotal({ cartItems });

  return { total, discountAmount: total - totalWithoutDiscount };
};

export default calculateTotal;
