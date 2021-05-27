import {
  Badge,
  Button,
  Card,
  Column,
  Columns,
  Heading,
  IconPromote,
  Inline,
  Stack,
  Text,
} from 'braid-design-system';
import React from 'react';

import { products } from 'src/App/dummyData';

import Product from '../Product';

export default ({ addToCart }: { addToCart: (product: Product) => void }) => (
  <Stack space="small" dividers>
    {products.map(({ ...product }) => (
      <Card key={product.id}>
        <Columns space="gutter" collapseBelow="tablet">
          <Column>
            <Stack space="gutter">
              <Inline space="small" alignY="center">
                <Heading level="3">{product.title}</Heading>
                <Badge tone="positive">{`$${
                  product.price.toString() || 0
                }`}</Badge>
              </Inline>
              <Text tone="secondary">{product.description}</Text>
            </Stack>
          </Column>
          <Column width="content">
            <Stack space="gutter">
              <Button size="small" onClick={() => addToCart(product)}>
                Add to cart <IconPromote />
              </Button>
            </Stack>
          </Column>
        </Columns>
      </Card>
    ))}
  </Stack>
);
