import 'braid-design-system/reset';

import { BraidLoadableProvider } from 'braid-design-system';
import React from 'react';

// import NextSteps from './NextSteps';
import Checkout from './Checkout';

interface AppProps {
  site: string;
}

export default ({ site }: AppProps) => (
  <BraidLoadableProvider themeName={site}>
    <Checkout />
  </BraidLoadableProvider>
);
