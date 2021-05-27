# checkout-demo

[![Test](https://github.com/tadhglewis/checkout-demo/actions/workflows/test.yml/badge.svg)](https://github.com/tadhglewis/checkout-demo/actions/workflows/test.yml)

You can view the actual discount logic below or view the live ui in front here [https://checkout-demo.pages.dev/apac](https://checkout-demo.pages.dev/apac)

Logic: [src/App/Checkout/useCheckout/calculateTotal.ts](https://github.com/tadhglewis/checkout-demo/blob/master/src/App/Checkout/useCheckout/calculateTotal.ts)

Unit test: [src/App/Checkout/useCheckout/calculateTotal.test.ts](https://github.com/tadhglewis/checkout-demo/blob/master/src/App/Checkout/useCheckout/calculateTotal.test.ts)

Products and pricing rules (dummy data): [src/App/dummyData.ts](https://github.com/tadhglewis/checkout-demo/blob/master/src/App/dummyData.ts)

I have built a ui for fun and to finally try out Braid - it's super clean :)

Discount Types
- Fixed - set ad to a specified price
- Percentage - remove a percentage off the base ad price
- Buy X get X free (technically x for x) - add x (5) ads to cart and remove the price of x (1)

----

This project is powered by [sku](https://github.com/seek-oss/sku), [braid](https://github.com/seek-oss/braid-design-system) and built with [React](https://facebook.github.io/react).

## Getting Started

First of all, make sure you&#39;ve installed [Yarn](https://yarnpkg.com).

Then, install dependencies:

```bash
$ yarn
```

## Workflow

Start a local development server:

```bash
$ yarn start
```

Run unit tests:

```bash
$ yarn test
```

Lint and format code:

```bash
$ yarn lint
$ yarn format
```

Build assets for production:

```bash
$ yarn build
```
