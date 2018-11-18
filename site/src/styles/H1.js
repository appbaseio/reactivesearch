import React from 'react';
import { H1 } from '@appbaseio/designkit';

export default ({ children, ...props }) => <H1 fontSize="2.8rem" {...props}>{children}</H1>;
