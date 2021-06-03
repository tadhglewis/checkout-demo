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

type BuyXDiscountX = {
  type: 'buyXDiscountX';
  sku: Sku;
  buyAmount: number;
  discountAmount: number;
};

export type PricingRule =
  | FixedDiscount
  | PercentageDiscount
  | BuyXGetXFreeDiscount
  | GetYWithXDiscount
  | BuyXDiscountX;

type CartItem = Partial<Record<Sku, number>>;

type ResolverArgs = {
  cartItems: CartItem;
  prices: CartItem;
  rule: PricingRule;
};

const commonVariables = ({
  rule,
  prices,
  cartItems,
}: {
  prices: CartItem;
  rule: PricingRule;
  cartItems: CartItem;
}) => ({ quantity: cartItems[rule.sku] || 0, price: prices[rule.sku] || 0 });

const percentageResolver = ({
  cartItems,
  rule,
  prices,
}: ResolverArgs & { rule: PercentageDiscount }): number => {
  const { quantity, price } = commonVariables({ rule, prices, cartItems });

  return price * (rule.percentage / 100) * quantity;
};

const buyXFreeXResolver = ({
  cartItems,
  rule,
  prices,
}: ResolverArgs & { rule: BuyXGetXFreeDiscount }): number => {
  const { quantity, price } = commonVariables({ rule, prices, cartItems });

  const freeQuantity = Math.floor(
    (quantity / rule.buyQuantity) * rule.freeQuantity,
  );

  return price * freeQuantity;
};

const getYWithXResolver = ({
  cartItems,
  rule,
  prices,
}: ResolverArgs & { rule: GetYWithXDiscount }): number => {
  const { price } = commonVariables({ rule, prices, cartItems });

  const quantity = Math.min(
    cartItems[rule.xSku] || 0,
    cartItems[rule.sku] || 0,
  );

  return price * quantity;
};

const buyXDiscountXResolver = ({
  cartItems,
  rule,
  prices,
}: ResolverArgs & { rule: BuyXDiscountX }): number => {
  const { quantity, price } = commonVariables({ rule, prices, cartItems });

  if (quantity >= rule.buyAmount) {
    return (price - rule.discountAmount) * quantity;
  }

  return 0;
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
    case 'buyXDiscountX':
      return buyXDiscountXResolver(
        args as ResolverArgs & { rule: BuyXDiscountX },
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
