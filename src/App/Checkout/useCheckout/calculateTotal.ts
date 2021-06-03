import { products } from '../../dummyData';
import { Sku } from '../Product';

type FixedDiscount = {
  type: 'fixed';
  amount: number;
  sku: Sku;
};

type PercentageDiscount = {
  type: 'percentage';
  percentage: number;
  sku: Sku;
};

type BuyXGetXFreeDiscount = {
  type: 'buyXFreeX';
  freeQuantity: number;
  buyQuantity: number;
  sku: Sku;
};

type GetYWithXDiscount = {
  type: 'getYWithX';
  xSku: Sku;
  sku: Sku;
};

export type PricingRule =
  | FixedDiscount
  | PercentageDiscount
  | BuyXGetXFreeDiscount
  | GetYWithXDiscount;

type CartItem = Partial<Record<Sku, number>>;

type ResolverArgs = {
  cartItems: CartItem;
  prices: CartItem;
  rule: PricingRule;
};

const percentageResolver = ({
  cartItems,
  rule,
  prices,
}: ResolverArgs & { rule: PercentageDiscount }): number => {
  let total = 0;
  const quantity = cartItems[rule.sku] || 0;
  const price = prices[rule.sku] || 0;

  total = price * (rule.percentage / 100) * quantity;

  return total;
};

const buyXFreeXResolver = ({
  cartItems,
  rule,
  prices,
}: ResolverArgs & { rule: BuyXGetXFreeDiscount }): number => {
  let total = 0;
  const quantity = cartItems[rule.sku] || 0;
  const price = prices[rule.sku] || 0;

  const freeQuantity = Math.floor(
    (quantity / rule.buyQuantity) * rule.freeQuantity,
  );

  total = price * freeQuantity;

  return total;
};

const getYWithXResolver = ({
  cartItems,
  rule,
  prices,
}: ResolverArgs & { rule: GetYWithXDiscount }): number => {
  let total = 0;
  const quantity = Math.min(
    cartItems[rule.xSku] || 0,
    cartItems[rule.sku] || 0,
  );

  const yPrice = prices[rule.sku] || 0;

  total = yPrice * quantity;

  return total;
};

const resolvers = (args: ResolverArgs) => {
  switch (args.rule.type) {
    case 'percentage':
      return percentageResolver(
        args as ResolverArgs & { rule: PercentageDiscount },
      );
    case 'buyXFreeX':
      return buyXFreeXResolver(
        args as ResolverArgs & { rule: BuyXGetXFreeDiscount },
      );
    case 'getYWithX':
      return getYWithXResolver(
        args as ResolverArgs & { rule: GetYWithXDiscount },
      );
    default:
      return 0;
  }
};

const calculateTotal = ({
  cartItems,
  pricingRules,
}: {
  cartItems: CartItem;
  pricingRules: PricingRule[];
}) => {
  const total = products
    .filter(({ sku }) => (Object.keys(cartItems) as Sku[]).includes(sku))
    .reduce(
      (result, { price, sku }) => result + price * (cartItems[sku] || 0),
      0,
    );

  const prices = (Object.keys(cartItems) as Sku[]).reduce<CartItem>(
    (result, sku) => {
      result[sku] =
        pricingRules.find(
          (pricingRule): pricingRule is FixedDiscount =>
            pricingRule.type === 'fixed' && pricingRule.sku === sku,
        )?.amount ||
        products.find(({ sku: productSku }) => sku === productSku)?.price;

      return result;
    },
    {},
  );

  const priceIncludingFixed = (Object.keys(cartItems) as Sku[]).reduce(
    (result, sku) => {
      const quantity = cartItems[sku] || 0;

      const price =
        pricingRules.find(
          (pricingRule): pricingRule is FixedDiscount =>
            pricingRule.type === 'fixed' && pricingRule.sku === sku,
        )?.amount ||
        products.find(({ sku: productSku }) => sku === productSku)?.price;

      return result + (price || 0) * quantity;
    },
    0,
  );

  let discountAmount = Object.keys(cartItems)
    .reduce<PricingRule[][]>((result, sku) => {
      const filteredPricingRule = pricingRules.filter(
        (rule) => rule.sku === sku || rule.sku === null,
      );

      return [
        ...result,
        ...(filteredPricingRule.length ? [filteredPricingRule] : []),
      ];
    }, [])
    .map((rules) =>
      Math.max(...rules.map((rule) => resolvers({ cartItems, rule, prices }))),
    )
    .reduce((result, num) => result + num, 0);

  discountAmount += total - priceIncludingFixed;

  return {
    total: Number((total - discountAmount).toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
  };
};

export default calculateTotal;
