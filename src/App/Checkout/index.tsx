import {
  Box,
  Button,
  Card,
  Column,
  Columns,
  ContentBlock,
  Dropdown,
  Heading,
  List,
  Stack,
  Text,
} from 'braid-design-system';
import React from 'react';

import { products } from '../dummyData';

import { Sku } from './Product';
import Products from './Products';
import useCheckout from './useCheckout';

export default () => {
  const { cart, add, cartItems, clear, customer, setCustomer } = useCheckout();

  return (
    <ContentBlock width="large">
      <Box background="brand" paddingY="xxlarge" paddingX="gutter">
        <Columns space="gutter" collapseBelow="tablet">
          <Column>
            <Stack space="medium">
              <Heading level="1">Checkout Demo</Heading>
            </Stack>
          </Column>
          <Column width="1/5">
            <Dropdown
              label="Customer"
              onChange={(e: any) => setCustomer(e.target.value)}
              value={customer}
              id=""
              placeholder="Default"
            >
              <option />
              <option>SecondBite</option>
              <option>Axil Coffee Roasters</option>
              <option>MYER</option>
            </Dropdown>
          </Column>
        </Columns>
      </Box>
      <Box paddingX={['xsmall', 'gutter']} style={{ marginTop: '-40px' }}>
        <Card>
          <Stack space="medium">
            <Stack space="large">
              <Columns space="gutter" collapseBelow="tablet">
                <Column width="3/4">
                  <Heading level="1">Ads</Heading>
                  <Products addToCart={add} />
                </Column>
                <Column width="1/4">
                  <Stack space="gutter">
                    <Heading level="2">Cart</Heading>
                    <List>
                      {(Object.keys(cartItems) as Sku[]).map((sku, index) => (
                        <Text key={sku + index}>
                          {
                            products.find((product) => product.sku === sku)
                              ?.title
                          }{' '}
                          x {cartItems[sku]}
                        </Text>
                      ))}
                    </List>
                    <Text>Total: ${cart.total.toFixed(2)}</Text>
                    <Text tone="brandAccent">
                      Discount: ${cart.discountAmount.toFixed(2)}
                    </Text>
                    <Columns space="gutter" collapseBelow="desktop">
                      <Column width="content">
                        <Button tone="brandAccent">Purchase</Button>
                      </Column>
                      <Column width="content">
                        <Button variant="soft" onClick={clear}>
                          Clear
                        </Button>
                      </Column>
                    </Columns>
                  </Stack>
                </Column>
              </Columns>
            </Stack>
          </Stack>
        </Card>
      </Box>
    </ContentBlock>
  );
};
