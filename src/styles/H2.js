import React from 'react';
import { H2 } from '@appbaseio/designkit';

export default ({ children, ...props }) => <H2 fontSize="2rem" lineHeight="2.4rem" {...props}>{children}</H2>;
